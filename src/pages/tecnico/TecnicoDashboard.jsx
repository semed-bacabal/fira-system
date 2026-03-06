import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { supabase } from "../../services/supabaseClient"

export default function TecnicoDashboard() {

  const [user,setUser] = useState(null)
  const [equipes,setEquipes] = useState([])

  const [eventos,setEventos] = useState([])
  const [categorias,setCategorias] = useState([])

  const [eventoId,setEventoId] = useState("")
  const [categoriaId,setCategoriaId] = useState("")
  const [nomeEquipe,setNomeEquipe] = useState("")
  const [mensagem,setMensagem] = useState("")

  useEffect(()=>{
    iniciar()
  },[])

  async function iniciar(){

    const { data } = await supabase.auth.getSession()
    const usuario = data.session?.user

    if(!usuario) return

    setUser(usuario)

    fetchEventos()
    fetchEquipes(usuario.id)

  }

  async function fetchEventos(){

    const { data } = await supabase
    .from("events")
    .select("*")

    setEventos(data || [])

  }

  async function fetchCategorias(evento){

    const { data } = await supabase
    .from("categories")
    .select("*")
    .eq("event_id",evento)

    setCategorias(data || [])

  }

  async function fetchEquipes(userId){

    const { data } = await supabase
    .from("teams")
    .select("*")
    .eq("tecnico_id",userId)
    .order("created_at",{ascending:false})

    setEquipes(data || [])

  }

  async function criarEquipe(e){

    e.preventDefault()

    if(!nomeEquipe || !eventoId || !categoriaId){
      setMensagem("Preencha todos os campos.")
      return
    }

    const eventoSelecionado = eventos.find(ev => ev.id === eventoId)

    const { error } = await supabase
    .from("teams")
    .insert([
      {
        nome:nomeEquipe,
        tecnico_id:user.id,
        event_id:eventoId,
        categoria_id:categoriaId,
        evento:eventoSelecionado?.nome || "",
        status:"draft"
      }
    ])

    if(error){
      console.log(error)
      setMensagem("Erro ao criar equipe.")
      return
    }

    setMensagem("Equipe criada com sucesso!")
    setNomeEquipe("")
    setEventoId("")
    setCategoriaId("")

    fetchEquipes(user.id)

  }

  return (

    <div className="container mt-5">

      <h2 className="mb-4">Painel do Técnico</h2>

      {/* Criar equipe */}

      <div className="card p-4 mb-4 shadow-sm">

        <h4>Criar Nova Equipe</h4>

        <form onSubmit={criarEquipe}>

          <input
          className="form-control mb-3"
          placeholder="Nome da equipe"
          value={nomeEquipe}
          onChange={(e)=>setNomeEquipe(e.target.value)}
          />

          <select
          className="form-select mb-3"
          value={eventoId}
          onChange={(e)=>{
            setEventoId(e.target.value)
            fetchCategorias(e.target.value)
          }}
          >
            <option value="">Selecione o Evento</option>

            {eventos.map(ev=>(
              <option key={ev.id} value={ev.id}>
                {ev.nome}
              </option>
            ))}

          </select>

          <select
          className="form-select mb-3"
          value={categoriaId}
          onChange={(e)=>setCategoriaId(e.target.value)}
          >

            <option value="">Selecione a Categoria</option>

            {categorias.map(cat=>(
              <option key={cat.id} value={cat.id}>
                {cat.nome}
              </option>
            ))}

          </select>

          <button className="btn btn-success">
            Criar Equipe
          </button>

        </form>

        {mensagem && (
          <div className="alert alert-info mt-3">
            {mensagem}
          </div>
        )}

      </div>

      {/* Minhas equipes */}

      <div className="card p-4 shadow-sm">

        <h4>Minhas Equipes</h4>

        {equipes.length === 0 ? (
          <p>Nenhuma equipe cadastrada.</p>
        ) : (

          equipes.map(equipe=>(
            <div
            key={equipe.id}
            className="border rounded p-3 mb-3"
            >

              <strong>{equipe.nome}</strong>

              <br/>

              Status: {equipe.status}

              <br/>

              <Link
              to={`/tecnico/equipe/${equipe.id}`}
              className="btn btn-primary btn-sm mt-2"
              >
                Editar Equipe
              </Link>

            </div>
          ))

        )}

      </div>

    </div>

  )
}