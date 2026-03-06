import { useEffect, useState } from "react"
import { supabase } from "../../services/supabaseClient"

export default function AdminGerenciarGrupos() {

  const [eventos,setEventos] = useState([])
  const [categorias,setCategorias] = useState([])
  const [provas,setProvas] = useState([])
  const [grupos,setGrupos] = useState([])
  const [dados,setDados] = useState({})

  const [eventoId,setEventoId] = useState("")
  const [categoriaId,setCategoriaId] = useState("")
  const [provaId,setProvaId] = useState("")

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
    if(provaId){
      fetchGrupos()
      fetchDados()
    }
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

  async function fetchGrupos(){

    const {data} = await supabase
      .from("groups")
      .select("*")
      .eq("prova_id",provaId)
      .order("nome")

    setGrupos(data || [])

  }

  async function fetchDados(){

  if(!provaId) return

  const {data} = await supabase
    .from("team_groups")
    .select(`
      group_id,
      seed,
      teams(id,nome),
      groups!inner(prova_id)
    `)
    .eq("groups.prova_id", provaId)

  const mapa = {}

  data?.forEach(item=>{

    if(!mapa[item.group_id]){
      mapa[item.group_id] = []
    }

    mapa[item.group_id].push({
      ...item.teams,
      seed:item.seed
    })

  })

  setDados(mapa)

}

  async function removerEquipe(teamId){

    if(!confirm("Remover equipe do grupo?")) return

    await supabase
      .from("team_groups")
      .delete()
      .eq("team_id",teamId)

    fetchDados()

  }

  async function toggleSeed(teamId,groupId,atual){

    await supabase
      .from("team_groups")
      .update({
        seed:!atual
      })
      .eq("team_id",teamId)
      .eq("group_id",groupId)

    fetchDados()

  }

  async function moverEquipe(teamId,novoGrupo){

    await supabase
      .from("team_groups")
      .update({
        group_id:novoGrupo
      })
      .eq("team_id",teamId)

    fetchDados()

  }

  return(

    <div>

      <h4>Gerenciar Grupos</h4>

      <div className="d-flex gap-2 mb-4">

        <select
        className="form-select"
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
        className="form-select"
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
        className="form-select"
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


      <div className="row">

        {grupos.map(grupo=>(

          <div className="col-md-3" key={grupo.id}>

            <div className="card mb-3">

              <div className="card-header">

                <strong>{grupo.nome}</strong>

              </div>

              <div className="card-body">

                {(dados[grupo.id] || []).map(team=>(

                  <div
                  key={team.id}
                  className="d-flex justify-content-between align-items-center mb-2"
                  >

                    <span>

                      {team.seed && "⭐ "}
                      {team.nome}

                    </span>

                    <div className="d-flex gap-1">

                      <button
                      className="btn btn-sm btn-warning"
                      onClick={()=>toggleSeed(team.id,grupo.id,team.seed)}
                      >
                      ⭐
                      </button>

                      <select
                      className="form-select form-select-sm"
                      onChange={e=>moverEquipe(team.id,e.target.value)}
                      >

                        <option>Mover</option>

                        {grupos.map(g=>(
                          <option key={g.id} value={g.id}>
                            {g.nome}
                          </option>
                        ))}

                      </select>

                      <button
                      className="btn btn-sm btn-danger"
                      onClick={()=>removerEquipe(team.id)}
                      >
                      X
                      </button>

                    </div>

                  </div>

                ))}

              </div>

            </div>

          </div>

        ))}

      </div>

    </div>

  )

}