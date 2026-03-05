import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { supabase } from "../../services/supabaseClient"

export default function PlacarAoVivo() {

  const { provaId } = useParams()
  const [grupos, setGrupos] = useState([])
  const [placar, setPlacar] = useState({})

  useEffect(() => {
    buscarGrupos()
    escutarRealtime()
  }, [provaId])

  const buscarGrupos = async () => {
    const { data } = await supabase
      .from("groups")
      .select("*")
      .eq("prova_id", provaId)

    setGrupos(data || [])

    data?.forEach(g => buscarRankingGrupo(g.id))
  }

  const buscarRankingGrupo = async (groupId) => {
    const { data } = await supabase.rpc("ranking_grupo", {
      group_id_param: groupId
    })

    setPlacar(prev => ({
      ...prev,
      [groupId]: data
    }))
  }

  const escutarRealtime = () => {
    supabase
      .channel("placar-live")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "scores" },
        () => {
          grupos.forEach(g => buscarRankingGrupo(g.id))
        }
      )
      .subscribe()
  }

  return (
    <div style={{ padding: 40, background: "#111", minHeight: "100vh", color: "#fff" }}>
      <h1 style={{ textAlign: "center", marginBottom: 40 }}>
        PLACAR AO VIVO
      </h1>

      <div style={{ display: "flex", gap: 40, justifyContent: "center" }}>
        {grupos.map(grupo => (
          <div key={grupo.id} style={{ width: 400 }}>
            <h2 style={{ textAlign: "center" }}>{grupo.nome}</h2>

            <table style={{ width: "100%", marginTop: 20 }}>
              <thead>
                <tr>
                  <th>Equipe</th>
                  <th>Nota</th>
                  <th>Tempo</th>
                </tr>
              </thead>
              <tbody>
                {placar[grupo.id]?.map(team => (
                  <tr key={team.team_id}>
                    <td>{team.nome}</td>
                    <td>{team.total_nota}</td>
                    <td>{team.total_tempo}s</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  )
}