import { useEffect, useState } from "react"
import { supabase } from "../../services/supabaseClient"

export default function AdminEquipes() {

  const [equipes, setEquipes] = useState([])
  const [eventos, setEventos] = useState([])
  const [eventoId, setEventoId] = useState("")
  const [nome, setNome] = useState("")

  useEffect(() => {
    fetchEventos()
  }, [])

  useEffect(() => {
    if (eventoId) fetchEquipes()
  }, [eventoId])

  async function fetchEventos() {

    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("nome")

    if (error) {
      console.error("Erro ao buscar eventos:", error)
      return
    }

    setEventos(data || [])
  }

  async function fetchEquipes() {

    const { data, error } = await supabase
      .from("teams")
      .select("*")
      .eq("event_id", eventoId)
      .order("nome")

    if (error) {
      console.error("Erro ao buscar equipes:", error)
      return
    }

    setEquipes(data || [])
  }

  async function criarEquipe() {

    const nomeEquipe = nome.trim()

    if (!eventoId) {
      alert("Selecione um evento")
      return
    }

    if (!nomeEquipe) {
      alert("Digite o nome da equipe")
      return
    }

    const { error } = await supabase
      .from("teams")
      .insert({
        nome: nomeEquipe,
        event_id: eventoId
      })

    if (error) {
      console.error("Erro ao criar equipe:", error)
      alert("Erro ao criar equipe")
      return
    }

    setNome("")
    fetchEquipes()
  }

  async function deletarEquipe(id) {

    const confirmar = confirm("Excluir equipe?")

    if (!confirmar) return

    const { error } = await supabase
      .from("teams")
      .delete()
      .eq("id", id)

    if (error) {
      console.error("Erro ao excluir equipe:", error)
      alert("Erro ao excluir equipe")
      return
    }

    fetchEquipes()
  }

  return (

    <div>

      <h4>Equipes</h4>

      <div className="d-flex gap-2 mb-3">

        <select
          className="form-select"
          value={eventoId}
          onChange={(e) => setEventoId(e.target.value)}
        >
          <option value="">Selecionar evento</option>

          {eventos.map(e => (
            <option key={e.id} value={e.id}>
              {e.nome}
            </option>
          ))}

        </select>

      </div>

      <div className="d-flex gap-2 mb-3">

        <input
          className="form-control"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Nome da equipe"
        />

        <button
          className="btn btn-success"
          onClick={criarEquipe}
        >
          Criar
        </button>

      </div>

      <table className="table table-striped">

        <thead>
          <tr>
            <th>Nome</th>
            <th style={{ width: "120px" }}>Ações</th>
          </tr>
        </thead>

        <tbody>

          {equipes.map(equipe => (

            <tr key={equipe.id}>

              <td>{equipe.nome}</td>

              <td>

                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => deletarEquipe(equipe.id)}
                >
                  Excluir
                </button>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  )
}