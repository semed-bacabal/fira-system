import { useEffect, useState } from "react"
import { supabase } from "../../services/supabaseClient"

export default function AdminGrupos() {

  const [eventos,setEventos] = useState([])
  const [categorias,setCategorias] = useState([])
  const [provas,setProvas] = useState([])
  const [grupos,setGrupos] = useState([])
  const [equipes,setEquipes] = useState([])

  const [equipesUsadas,setEquipesUsadas] = useState([])

  const [eventoId,setEventoId] = useState("")
  const [categoriaId,setCategoriaId] = useState("")
  const [provaId,setProvaId] = useState("")
  const [grupoId,setGrupoId] = useState("")

  const [numeroGrupos,setNumeroGrupos] = useState(2)

  const [selectedTeams,setSelectedTeams] = useState([])
  const [seedTeam,setSeedTeam] = useState(null)

  useEffect(()=>{
    fetchEventos()
  },[])

  useEffect(()=>{
    if(eventoId){
      fetchCategorias()
      fetchEquipes()
      fetchProvas()
    }
  },[eventoId])

  useEffect(()=>{
    if(provaId){
      fetchGrupos()
      fetchEquipesUsadas()
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

  async function fetchEquipes(){

    const {data} = await supabase
      .from("teams")
      .select("*")
      .eq("event_id",eventoId)
      .order("nome")

    setEquipes(data || [])

  }

  async function fetchEquipesUsadas(){

    const {data} = await supabase
      .from("team_groups")
      .select("team_id")

    setEquipesUsadas(data?.map(t=>t.team_id) || [])

  }

  async function criarGrupos(){

    if(!provaId){
      alert("Selecione uma prova")
      return
    }

    const letras = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"

    const novos = []

    for(let i=0;i<numeroGrupos;i++){

      novos.push({
        nome:"Grupo "+letras[i],
        prova_id:provaId
      })

    }

    await supabase
      .from("groups")
      .insert(novos)

    fetchGrupos()

  }

  function toggleTeam(teamId){

    if(selectedTeams.includes(teamId)){

      setSelectedTeams(
        selectedTeams.filter(id=>id!==teamId)
      )

    }else{

      setSelectedTeams([...selectedTeams,teamId])

    }

  }

  async function salvarGrupo(){

    if(!grupoId){
      alert("Selecione grupo")
      return
    }

    if(selectedTeams.length===0){
      alert("Selecione equipes")
      return
    }

    for(let teamId of selectedTeams){

      await supabase
        .from("team_groups")
        .insert({
          group_id:grupoId,
          team_id:teamId,
          seed: teamId===seedTeam
        })

    }

    alert("Grupo salvo")

    setSelectedTeams([])
    setSeedTeam(null)

    fetchEquipesUsadas()

  }

  const equipesDisponiveis = equipes.filter(
    e => !equipesUsadas.includes(e.id)
  )

  return(

    <div>

      <h4>Gerenciar Grupos</h4>

      <div className="d-flex gap-2 mb-3">

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

      {provaId && (

        <div className="mb-4">

          <label>Número de grupos</label>

          <div className="d-flex gap-2">

            <input
              type="number"
              className="form-control"
              value={numeroGrupos}
              onChange={e=>setNumeroGrupos(e.target.value)}
            />

            <button
              className="btn btn-success"
              onClick={criarGrupos}
            >
              Criar Grupos
            </button>

          </div>

        </div>

      )}

      {provaId && (

        <div className="mb-3">

          <label>Selecionar Grupo</label>

          <select
            className="form-select"
            value={grupoId}
            onChange={e=>setGrupoId(e.target.value)}
          >

            <option value="">Selecione</option>

            {grupos.map(g=>(
              <option key={g.id} value={g.id}>
                {g.nome}
              </option>
            ))}

          </select>

        </div>

      )}

      {grupoId && (

        <>

          <h5>Selecionar Equipes</h5>

          <div className="row">

            {equipesDisponiveis.map(team=>(
              
              <div key={team.id} className="col-md-4 mb-2">

                <div className="card p-2">

                  <div className="form-check">

                    <input
                      type="checkbox"
                      className="form-check-input"
                      checked={selectedTeams.includes(team.id)}
                      onChange={()=>toggleTeam(team.id)}
                    />

                    <label className="form-check-label">

                      {team.nome}

                    </label>

                  </div>

                  {selectedTeams.includes(team.id) && (

                    <button
                      className={`btn btn-sm mt-2 ${
                        seedTeam===team.id
                        ? "btn-warning"
                        : "btn-outline-warning"
                      }`}
                      onClick={()=>setSeedTeam(team.id)}
                    >
                      ⭐ Cabeça de chave
                    </button>

                  )}

                </div>

              </div>

            ))}

          </div>

          <button
            className="btn btn-primary mt-3"
            onClick={salvarGrupo}
          >
            Salvar Grupo
          </button>

        </>

      )}

    </div>

  )

}