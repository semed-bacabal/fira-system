import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../../services/supabaseClient"

export default function ArbitroDashboard() {

  const navigate = useNavigate()
  const [eventos, setEventos] = useState([])

  useEffect(() => {
    buscarEventos()
  }, [])

  const buscarEventos = async () => {
    const { data } = await supabase
      .from("events")
      .select("id, nome")

    setEventos(data || [])
  }

  return (
    <div className="container mt-5 text-center">
      <h2>Selecionar Evento</h2>

      <div className="d-flex flex-wrap justify-content-center gap-3 mt-4">
        {eventos.map((evento) => (
          <button
            key={evento.id}
            className="btn btn-primary btn-lg"
            onClick={() =>
              navigate(`/arbitro/categorias/${evento.id}`)
            }
          >
            {evento.nome}
          </button>
        ))}
      </div>
    </div>
  )
}