import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { supabase } from "../../services/supabaseClient"

export default function ArbitroProvas() {

  const navigate = useNavigate()
  const { eventoId, categoriaId } = useParams()

  const [provas, setProvas] = useState([])
  const [evento, setEvento] = useState(null)
  const [categoria, setCategoria] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (eventoId && categoriaId) {
      buscarDados()
    }
  }, [eventoId, categoriaId])

  const buscarDados = async () => {
    try {
      setLoading(true)

      // 🔹 Buscar evento
      const { data: eventoData } = await supabase
        .from("events")
        .select("id, nome")
        .eq("id", eventoId)
        .single()

      setEvento(eventoData)

      // 🔹 Buscar categoria
      const { data: categoriaData } = await supabase
        .from("categories")
        .select("id, nome")
        .eq("id", categoriaId)
        .single()

      setCategoria(categoriaData)

      // 🔹 Buscar provas do EVENTO (não da categoria)
      const { data: provasData, error } = await supabase
        .from("provas")
        .select("id, nome")
        .eq("event_id", eventoId)

      if (error) {
        console.error("Erro ao buscar provas:", error)
        setProvas([])
      } else {
        setProvas(provasData || [])
      }

    } catch (err) {
      console.error("Erro geral:", err)
      setProvas([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mt-5 text-center">

      <h2>
        Evento: {evento ? evento.nome : "Carregando..."}
      </h2>

      <h3>
        Categoria: {categoria ? categoria.nome : "Carregando..."}
      </h3>

      <h4 className="mt-4">Selecionar Prova</h4>

      {loading && <p>Carregando provas...</p>}

      {!loading && provas.length === 0 && (
        <p>Nenhuma prova encontrada.</p>
      )}

      <div className="d-flex flex-wrap justify-content-center gap-3 mt-4">
        {provas.map((prova) => (
          <button
            key={prova.id}
            className="btn btn-outline-success btn-lg"
            onClick={() =>
              navigate(`/arbitro/equipes/${eventoId}/${categoriaId}/${prova.id}`)
            }
          >
            {prova.nome.toUpperCase()}
          </button>
        ))}
      </div>

    </div>
  )
}