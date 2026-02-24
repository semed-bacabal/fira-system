import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { supabase } from "../../services/supabaseClient"

export default function TecnicoDashboard() {

  const [nomeEquipe, setNomeEquipe] = useState("")
  const [categoria, setCategoria] = useState("")
  const [mensagem, setMensagem] = useState("")
  const [equipes, setEquipes] = useState([])
  const [user, setUser] = useState(null)

  useEffect(() => {
    getUser()
  }, [])

  const getUser = async () => {
    const { data } = await supabase.auth.getSession()
    const currentUser = data.session?.user

    if (!currentUser) return

    setUser(currentUser)
    fetchEquipes(currentUser.id)
  }

  const fetchEquipes = async (userId) => {
    const { data, error } = await supabase
      .from("teams")
      .select("*")
      .eq("tecnico_id", userId)
      .order("created_at", { ascending: false })

    if (!error) {
      setEquipes(data)
    }
  }

  const criarEquipe = async (e) => {
    e.preventDefault()

    if (!nomeEquipe || !categoria) {
      setMensagem("Preencha todos os campos.")
      return
    }

    const { data, error } = await supabase
      .from("teams")
      .insert([
        {
          nome: nomeEquipe,
          categoria: categoria,
          tecnico_id: user.id
        }
      ])
      .select()

    if (error) {
      setMensagem("Erro ao criar equipe.")
      return
    }

    setMensagem("Equipe criada com sucesso!")
    setNomeEquipe("")
    setCategoria("")
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
            className="form-control mb-2"
            placeholder="Nome da Equipe"
            value={nomeEquipe}
            onChange={(e) => setNomeEquipe(e.target.value)}
          />

          <select
            className="form-select mb-3"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            required
          >
            <option value="">Selecione o Evento</option>
            <option value="America">América</option>
            <option value="Estadual">Estadual</option>
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

      {/* Lista de equipes */}
      <div className="card p-4 shadow-sm">
        <h4>Minhas Equipes</h4>

        {equipes.length === 0 ? (
          <p>Nenhuma equipe cadastrada ainda.</p>
        ) : (
          equipes.map((equipe) => (
            <div
              key={equipe.id}
              className="border rounded p-3 mb-3"
            >
              <strong>{equipe.nome}</strong>
              <br />
              Evento: {equipe.categoria || "—"}
              <br />
              Status: {equipe.validado ? (
                <span className="badge bg-success">Validado</span>
              ) : (
                <span className="badge bg-warning text-dark">Pendente</span>
              )}
              <br />
              QR Token: {equipe.qr_token}
              <br />

              <Link 
                to={`/tecnico/equipe/${equipe.id}`}
                className="btn btn-primary btn-sm mt-2"
              >
                Gerenciar Equipe
              </Link>
            </div>
          ))
        )}

      </div>

    </div>
  )
}