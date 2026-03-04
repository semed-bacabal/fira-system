import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { supabase } from "../../services/supabaseClient"

export default function ArbitroEquipes() {

  const navigate = useNavigate()
  const { eventoId, categoriaId, provaId } = useParams()

  const [equipes, setEquipes] = useState([])
  const [busca, setBusca] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (categoriaId) {
      buscarEquipes()
    }
  }, [categoriaId])

  const buscarEquipes = async () => {
    try {
      setLoading(true)

      // 🔹 Buscar equipes da categoria
      const { data, error } = await supabase
        .from("teams")
        .select("id, nome, categoria_id")
        .eq("categoria_id", categoriaId)

      if (error) {
        console.log("Erro ao buscar equipes:", error)
        setEquipes([])
      } else {
        setEquipes(data || [])
      }

    } catch (err) {
      console.log("Erro geral:", err)
      setEquipes([])
    } finally {
      setLoading(false)
    }
  }

  const equipesFiltradas = equipes.filter(e =>
    e.nome.toLowerCase().includes(busca.toLowerCase())
  )

  return (
    <div className="container mt-4">

      <h3>Selecionar Equipe</h3>

      <input
        type="text"
        className="form-control my-3"
        placeholder="🔍 Buscar equipe..."
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
      />

      {loading && <p>Carregando equipes...</p>}

      {!loading && equipesFiltradas.length === 0 && (
        <p>Nenhuma equipe encontrada.</p>
      )}

      <div className="list-group">
        {equipesFiltradas.map((equipe) => (
          <button
            key={equipe.id}
            className="list-group-item list-group-item-action"
            onClick={() =>
              navigate(`/arbitro/avaliar/${eventoId}/${categoriaId}/${provaId}/${equipe.id}`)
            }
          >
            {equipe.nome}
          </button>
        ))}
      </div>

    </div>
  )
}