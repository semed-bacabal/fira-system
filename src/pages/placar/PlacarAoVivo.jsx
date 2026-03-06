import { useEffect, useState } from "react"
import { supabase } from "../../services/supabaseClient"

export default function PlacarAoVivo(){

  const [eventos,setEventos] = useState([])
  const [categorias,setCategorias] = useState([])
  const [provas,setProvas] = useState([])

  const [eventoId,setEventoId] = useState("")
  const [categoriaId,setCategoriaId] = useState("")
  const [provaId,setProvaId] = useState("")

  const [ranking,setRanking] = useState([])
  const [animar,setAnimar] = useState(false)

  useEffect(()=>{
    fetchEventos()
  },[])

  useEffect(()=>{
    if(eventoId){
      fetchCategorias()
      fetchProvas()
    }
  },[eventoId])


  useEffect(()=>{

    if(!provaId) return

    fetchRanking()

    const channel = supabase
      .channel("placar-scores")

      .on(
        "postgres_changes",
        {
          event:"*",
          schema:"public",
          table:"scores"
        },

        payload=>{
          fetchRanking()
        }

      )

      .subscribe()

    return ()=> supabase.removeChannel(channel)

  },[provaId])


  async function fetchEventos(){

    const {data} = await supabase
      .from("events")
      .select("*")
      .order("nome")

    setEventos(data || [])

  }


  async function fetchCategorias(){

    const {data} = await supabase
      .from("categories")
      .select("*")
      .eq("event_id",eventoId)
      .order("nome")

    setCategorias(data || [])

  }


  async function fetchProvas(){

    const {data} = await supabase
      .from("provas")
      .select("*")
      .eq("event_id",eventoId)
      .order("nome")

    setProvas(data || [])

  }


  async function fetchRanking(){

    const {data,error} = await supabase
      .from("scores")
      .select(`
        team_id,
        nota,
        tempo,
        teams(nome)
      `)
      .eq("prova_id",provaId)

    if(error){
      console.log(error)
      return
    }

    const ordenado = data
      .map(r=>({
        ...r,
        equipe:r.teams?.nome
      }))
      .sort((a,b)=>{
        if(b.nota !== a.nota) return b.nota - a.nota
        return a.tempo - b.tempo
      })

    setRanking(ordenado)

    setAnimar(true)

    setTimeout(()=>{
      setAnimar(false)
    },600)

  }



  return(

  <div className="placar-container">

    {/* filtros */}

    <div className="placar-filtros">

      <select
      value={eventoId}
      onChange={e=>setEventoId(e.target.value)}
      >

        <option value="">Evento</option>

        {eventos.map(e=>(
          <option key={e.id} value={e.id}>
            {e.nome}
          </option>
        ))}

      </select>


      <select
      value={categoriaId}
      onChange={e=>setCategoriaId(e.target.value)}
      >

        <option value="">Categoria</option>

        {categorias.map(c=>(
          <option key={c.id} value={c.id}>
            {c.nome}
          </option>
        ))}

      </select>


      <select
      value={provaId}
      onChange={e=>setProvaId(e.target.value)}
      >

        <option value="">Prova</option>

        {provas.map(p=>(
          <option key={p.id} value={p.id}>
            {p.nome}
          </option>
        ))}

      </select>

    </div>



    {/* ranking */}

    <div className={`placar-ranking ${animar ? "update" : ""}`}>

      {ranking.map((team,index)=>{

        const medalha =
          index === 0 ? "🥇" :
          index === 1 ? "🥈" :
          index === 2 ? "🥉" :
          `${index+1}º`

        return(

          <div
            key={team.team_id}
            className={`placar-linha ${index===0 ? "lider" : ""}`}
          >

            <div className="placar-pos">

              {medalha}

            </div>


            <div className="placar-equipe">

              {team.equipe}

            </div>


            <div className="placar-pontos">

              {team.nota}

            </div>

          </div>

        )

      })}

    </div>

  </div>

  )

}