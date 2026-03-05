import { useEffect, useState } from "react"
import { supabase } from "../../services/supabaseClient"

export default function AdminCategorias() {

  const [categorias, setCategorias] = useState([])
  const [eventos, setEventos] = useState([])
  const [eventoId, setEventoId] = useState("")
  const [nome, setNome] = useState("")

  useEffect(() => {
    fetchEventos()
  }, [])

  useEffect(() => {
    if (eventoId) fetchCategorias()
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

  async function fetchCategorias() {

    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("event_id", eventoId)
      .order("nome")

    if (error) {
      console.error("Erro ao buscar categorias:", error)
      return
    }

    setCategorias(data || [])
  }

  async function criarCategoria() {

    const nomeCategoria = nome.trim()

    if (!eventoId) {
      alert("Selecione um evento")
      return
    }

    if (!nomeCategoria) {
      alert("Digite o nome da categoria")
      return
    }

    const { error } = await supabase
      .from("categories")
      .insert({
        nome: nomeCategoria,
        event_id: eventoId
      })

    if (error) {
      console.error("Erro ao criar categoria:", error)
      alert("Erro ao criar categoria")
      return
    }

    setNome("")
    fetchCategorias()
  }

  async function deletarCategoria(id) {

    const confirmar = confirm("Excluir categoria?")

    if (!confirmar) return

    const { error } = await supabase
      .from("categories")
      .delete()
      .eq("id", id)

    if (error) {
      console.error("Erro ao excluir categoria:", error)
      alert("Erro ao excluir categoria")
      return
    }

    fetchCategorias()
  }

  return (

    <div>

      <h4>Categorias</h4>

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
          placeholder="Nome da categoria"
        />

        <button
          className="btn btn-success"
          onClick={criarCategoria}
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

          {categorias.map(categoria => (

            <tr key={categoria.id}>

              <td>{categoria.nome}</td>

              <td>

                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => deletarCategoria(categoria.id)}
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