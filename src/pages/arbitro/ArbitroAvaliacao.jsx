import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { supabase } from "../../services/supabaseClient"

export default function ArbitroAvaliacao() {

  const { eventoId, categoriaId, provaId, equipeId } = useParams()
  const navigate = useNavigate()

  const [nota, setNota] = useState("")
  const [tempo, setTempo] = useState(0)
  const [rodando, setRodando] = useState(false)
  const [equipe, setEquipe] = useState(null)
  const [provaData, setProvaData] = useState(null)
  const [salvando, setSalvando] = useState(false)

  // 🔹 Buscar equipe e prova por ID
  useEffect(() => {
    async function fetchData() {

      const { data: team, error: teamError } = await supabase
        .from("teams")
        .select("id, nome")
        .eq("id", equipeId)
        .single()

      if (teamError) {
        console.log("Erro equipe:", teamError)
      }

      const { data: provaInfo, error: provaError } = await supabase
        .from("provas")
        .select("id, nome")
        .eq("id", provaId)
        .single()

      if (provaError) {
        console.log("Erro prova:", provaError)
      }

      setEquipe(team)
      setProvaData(provaInfo)
    }

    if (equipeId && provaId) {
      fetchData()
    }

  }, [equipeId, provaId])

  // 🔹 Cronômetro
  useEffect(() => {
    let interval
    if (rodando) {
      interval = setInterval(() => {
        setTempo(prev => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [rodando])

  const iniciarProva = () => {
    setTempo(0)
    setRodando(true)
  }

  const finalizarProva = () => {
    setRodando(false)
  }

  const salvarAvaliacao = async () => {
  if (!nota) return alert("Digite a nota")
  if (!provaData) return alert("Prova não encontrada")

  setSalvando(true)

  // 🔹 pegar usuário logado
  const { data: sessionData } = await supabase.auth.getSession()
  const user = sessionData.session?.user

  if (!user) {
    alert("Usuário não autenticado")
    setSalvando(false)
    return
  }

  const { error } = await supabase
    .from("scores")
    .insert([
      {
        team_id: equipeId,
        prova_id: provaData.id,
        arbitro_id: user.id, // 👈 AQUI ESTÁ A CORREÇÃO
        nota: parseFloat(nota),
        tempo: tempo
      }
    ])

  setSalvando(false)

  if (error) {
    console.log(error)
    alert("Erro ao salvar avaliação")
  } else {
    alert("Avaliação salva com sucesso!")
    navigate(-1)
  }
}

  return (
    <div className="container mt-4">

      <h2>Avaliação</h2>

      {equipe && (
        <p><strong>Equipe:</strong> {equipe.nome}</p>
      )}

      {provaData && (
        <p><strong>Prova:</strong> {provaData.nome}</p>
      )}

      <hr />

      <h4>Tempo: {tempo}s</h4>

      <button onClick={iniciarProva} disabled={rodando}>
        Iniciar Prova
      </button>

      <button onClick={finalizarProva} disabled={!rodando}>
        Finalizar Prova
      </button>

      <hr />

      <div>
        <label>Nota:</label>
        <input
          type="number"
          step="0.1"
          value={nota}
          onChange={(e) => setNota(e.target.value)}
        />
      </div>

      <br />

      <button onClick={salvarAvaliacao} disabled={salvando}>
        {salvando ? "Salvando..." : "Salvar Avaliação"}
      </button>

    </div>
  )
}