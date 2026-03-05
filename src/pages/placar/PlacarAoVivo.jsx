import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { supabase } from "../../services/supabaseClient"
import { motion, AnimatePresence } from "framer-motion"

export default function PlacarAoVivo() {

  const { provaId } = useParams()

  const [grupos, setGrupos] = useState([])
  const [placar, setPlacar] = useState({})

  useEffect(() => {
    buscarGrupos()
  }, [provaId])

  useEffect(() => {
    if (grupos.length > 0) escutarRealtime()
  }, [grupos])

  async function buscarGrupos() {

    const { data } = await supabase
      .from("groups")
      .select("*")
      .eq("prova_id", provaId)

    setGrupos(data || [])

    data?.forEach(g => buscarRankingGrupo(g.id))
  }

  async function buscarRankingGrupo(groupId) {

    const { data } = await supabase.rpc("ranking_grupo", {
      group_id_param: groupId
    })

    setPlacar(prev => ({
      ...prev,
      [groupId]: data
    }))
  }

  function escutarRealtime() {

    supabase
      .channel("placar-live")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "scores"
        },
        payload => {

          const teamId = payload.new?.team_id

          grupos.forEach(g => {
            buscarRankingGrupo(g.id)
          })

        }
      )
      .subscribe()
  }

  function medalha(pos) {

    if (pos === 1) return "🥇"
    if (pos === 2) return "🥈"
    if (pos === 3) return "🥉"
    return pos
  }

  return (

    <div style={{ padding: 40, background: "#111", minHeight: "100vh", color: "#fff" }}>

      <h1 style={{ textAlign: "center", marginBottom: 40 }}>
        PLACAR AO VIVO
      </h1>

      <div style={{ display: "flex", gap: 40, justifyContent: "center" }}>

        {grupos.map(grupo => (

          <div key={grupo.id} style={{ width: 420 }}>

            <h2 style={{ textAlign: "center" }}>
              {grupo.nome}
            </h2>

            <table style={{ width: "100%", marginTop: 20 }}>

              <thead>
                <tr>
                  <th>Pos</th>
                  <th>Equipe</th>
                  <th>Nota</th>
                  <th>Tempo</th>
                </tr>
              </thead>

              <tbody>

            <AnimatePresence>

              {placar[grupo.id]?.map((team, index) => {

                const maxNota = placar[grupo.id][0]?.total_nota || 1
                const larguraBarra = (team.total_nota / maxNota) * 100

                return (

                  <motion.tr
                    key={team.team_id}
                    layout
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    style={{
                      background: team.posicao === 1 ? "#1f2937" : "transparent",
                      fontWeight: team.posicao <= 3 ? "bold" : "normal"
                    }}
                  >

                    <td style={{ fontSize: 26 }}>
                      {medalha(team.posicao)}
                    </td>

                    <td>{team.nome}</td>

                    <td style={{ width: 100 }}>
                      {team.total_nota}
                    </td>

                    <td style={{ width: 100 }}>
                      {team.total_tempo}s
                    </td>

                    <td style={{ width: 200 }}>

                      <div style={{
                        height: 12,
                        background: "#333",
                        borderRadius: 6
                      }}>

                        <motion.div
                          layout
                          animate={{ width: `${larguraBarra}%` }}
                          transition={{ duration: 0.6 }}
                          style={{
                            height: "100%",
                            background:
                              team.posicao === 1
                                ? "#FFD700"
                                : team.posicao === 2
                                ? "#C0C0C0"
                                : team.posicao === 3
                                ? "#CD7F32"
                                : "#00ff88",
                            borderRadius: 6
                          }}
                        />

                      </div>

                    </td>

                  </motion.tr>

                )
              })}

            </AnimatePresence>

            </tbody>

            </table>

          </div>

        ))}

      </div>

    </div>
  )
}