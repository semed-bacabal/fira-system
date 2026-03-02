import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { supabase } from "../../services/supabaseClient"

export default function EquipeDetalheMonitor() {

  const { id } = useParams()

  const [equipe, setEquipe] = useState(null)
  const [participantes, setParticipantes] = useState([])
  const [tecnico, setTecnico] = useState(null)

  useEffect(() => {

    const carregarEquipe = async () => {

  // 1️⃣ Busca equipe pelo qr_token
  const { data: equipeData } = await supabase
    .from("teams")
    .select("*")
    .eq("qr_token", id)
    .single()

  if (!equipeData) return

  setEquipe(equipeData)

  // 2️⃣ Agora busca membros usando o ID REAL da equipe
  const { data: membros } = await supabase
    .from("team_members")
    .select("*")
    .eq("team_id", equipeData.id)

  setParticipantes(membros || [])

  // 3️⃣ Busca técnico
  if (equipeData.tecnico_id) {
    const { data: tecnicoData } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", equipeData.tecnico_id)
      .single()

    setTecnico(tecnicoData)
  }
}

    carregarEquipe()

  }, [id])

  return (
    <div className="container mt-4">

      {equipe && (
        <>
          <h2 className="text-center">{equipe.nome}</h2>

          <div className="text-center my-3">
            <img
              src={equipe.escudo_url}
              alt="Escudo"
              width="150"
            />
          </div>

          <div className="row">
            {participantes.map((p) => (
              <div key={p.id} className="col-md-3 text-center mb-3">
                <img
                  src={p.foto_url}
                  alt={p.nome}
                  className="img-fluid rounded"
                />
                <p>{p.nome}</p>
              </div>
            ))}
          </div>

          {tecnico && (
            <div className="text-center mt-4">
              <h5>Técnico</h5>
              <img
                src={tecnico.foto_url}
                alt={tecnico.nome}
                width="120"
                className="rounded"
              />
              <p>{tecnico.nome}</p>
            </div>
          )}
        </>
      )}

    </div>
  )
}