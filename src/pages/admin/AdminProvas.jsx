import { useEffect, useState } from "react"
import { supabase } from "../../services/supabaseClient"

export default function AdminProvas() {

  const [eventos, setEventos] = useState([])
  const [categorias, setCategorias] = useState([])
  const [provas, setProvas] = useState([])

  const [eventoId, setEventoId] = useState("")
  const [categoriaId, setCategoriaId] = useState("")
  const [nome, setNome] = useState("")

  useEffect(() => {
    fetchEventos()
  }, [])

  useEffect(() => {
    if (eventoId) fetchCategorias()
  }, [eventoId])

  useEffect(() => {
    if (eventoId) fetchProvas()
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

  async function fetchProvas() {

    const { data, error } = await supabase
      .from("provas")
      .select("*")
      .eq("event_id", eventoId)
      .order("nome")

    if (error) {
      console.error("Erro ao buscar provas:", error)
      return
    }

    setProvas(data || [])
  }

  async function criarProva() {

    const nomeProva = nome.trim()

    if (!eventoId) {
      alert("Selecione uma categoria")
      return
    }

    if (!nomeProva) {
      alert("Digite o nome da prova")
      return
    }

    const { error } = await supabase
      .from("provas")
      .insert({
        nome: nomeProva,
        event_id: eventoId
      })

    if (error) {
      console.error("Erro ao criar prova:", error)
      alert("Erro ao criar prova")
      return
    }

    setNome("")
    fetchProvas()
  }

  async function deletarProva(provaId) {

    const confirmar = confirm("Excluir prova? Isso apagará grupos e vínculos.")

    if (!confirmar) return

    // buscar grupos da prova
    const { data: grupos } = await supabase
      .from("groups")
      .select("id")
      .eq("prova_id", provaId)

    if (grupos && grupos.length > 0) {

      const groupIds = grupos.map(g => g.id)

      await supabase
        .from("team_groups")
        .delete()
        .in("group_id", groupIds)

      await supabase
        .from("groups")
        .delete()
        .eq("prova_id", provaId)
    }

    await supabase
      .from("scores")
      .delete()
      .eq("prova_id", provaId)

    const { error } = await supabase
      .from("provas")
      .delete()
      .eq("id", provaId)

    if (error) {
      console.error("Erro ao excluir prova:", error)
      alert("Erro ao excluir prova")
      return
    }

    fetchProvas()
  }

  return (

    <div>

      <h4>Provas</h4>

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

        <select
          className="form-select"
          value={categoriaId}
          onChange={(e) => setCategoriaId(e.target.value)}
        >
          <option value="">Selecionar categoria</option>

          {categorias.map(c => (
            <option key={c.id} value={c.id}>
              {c.nome}
            </option>
          ))}

        </select>

      </div>

      <div className="d-flex gap-2 mb-3">

        <input
          className="form-control"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Nome da prova"
        />

        <button
          className="btn btn-success"
          onClick={criarProva}
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

          {provas.map(prova => (

            <tr key={prova.id}>

              <td>{prova.nome}</td>

              <td>

                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => deletarProva(prova.id)}
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