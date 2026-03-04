import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { supabase } from "../../services/supabaseClient"

export default function ArbitroCategorias() {

  const navigate = useNavigate()
  const { eventoId } = useParams()

  const [categorias, setCategorias] = useState([])
  const [evento, setEvento] = useState(null)

  useEffect(() => {
    buscarDados()
  }, [eventoId])

  const buscarDados = async () => {
    // Buscar evento
    const { data: eventoData } = await supabase
      .from("events")
      .select("id, nome")
      .eq("id", eventoId)
      .single()

    setEvento(eventoData)

    // Buscar categorias do evento
    const { data: categoriasData } = await supabase
      .from("categories")
      .select("id, nome")
      .eq("event_id", eventoId)

    setCategorias(categoriasData || [])
  }

  return (
    <div className="container mt-5 text-center">

      <h2>
        Evento: {evento ? evento.nome : "Carregando..."}
      </h2>

      <h3 className="mt-4">Selecionar Categoria</h3>

      <div className="d-flex flex-wrap justify-content-center gap-3 mt-4">
        {categorias.map((cat) => (
          <button
            key={cat.id}
            className="btn btn-outline-primary btn-lg"
            onClick={() =>
              navigate(`/arbitro/provas/${eventoId}/${cat.id}`)
            }
          >
            {cat.nome.toUpperCase()}
          </button>
        ))}
      </div>

    </div>
  )
}