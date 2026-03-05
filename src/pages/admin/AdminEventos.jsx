import { useEffect, useState } from "react"
import { supabase } from "../../services/supabaseClient"

export default function AdminEventos() {

  const [eventos, setEventos] = useState([])
  const [nome, setNome] = useState("")

  useEffect(() => {
    fetchEventos()
  }, [])

  async function fetchEventos() {

    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("created_at", { ascending: true })

    if (error) {
      console.error("Erro ao buscar eventos:", error)
      alert("Erro ao carregar eventos")
      return
    }

    setEventos(data || [])
  }

    async function criarEvento() {

    const nomeEvento = nome.trim()

    if (!nomeEvento) {
      alert("Digite o nome do evento")
      return
    }

    const { error } = await supabase
      .from("events")
      .insert([
        { nome: nomeEvento }
      ])

    if (error) {
      console.error("Erro ao criar evento:", error)
      alert("Erro ao criar evento")
      return
    }

    setNome("")
    fetchEventos()
  }

  async function deletarEvento(id) {

    const confirmar = confirm("Tem certeza que deseja excluir este evento?")

    if (!confirmar) return

    const { error } = await supabase
      .from("events")
      .delete()
      .eq("id", id)

    if (error) {
      console.error("Erro ao excluir evento:", error)
      alert("Erro ao excluir evento")
      return
    }

    fetchEventos()
  }

  return (

    <div>

      <h4>Eventos</h4>

      <div className="d-flex gap-2 mb-3">

        <input
          className="form-control"
          placeholder="Nome do evento"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />

        <button
          className="btn btn-success"
          onClick={criarEvento}
        >
          Criar
        </button>

      </div>

      <table className="table table-striped">

        <thead>
          <tr>
            <th>Evento</th>
            <th style={{ width: "120px" }}>Ações</th>
          </tr>
        </thead>

        <tbody>

          {eventos.map((e) => (

            <tr key={e.id}>

              <td>{e.nome}</td>

              <td>

                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => deletarEvento(e.id)}
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