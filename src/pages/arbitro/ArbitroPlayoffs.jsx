import { useEffect, useState } from "react"
import { supabase } from "../../services/supabaseClient"

export default function ArbitroPlayoffs(){

  const [provas,setProvas] = useState([])
  const [provaId,setProvaId] = useState("")
  const [matches,setMatches] = useState([])
  const [fase,setFase] = useState("")

  useEffect(()=>{
    fetchProvas()
  },[])

  useEffect(()=>{
    if(provaId){
      fetchMatches()
    }
  },[provaId])


  async function fetchProvas(){

    const {data} = await supabase
      .from("provas")
      .select("*")
      .order("nome")

    setProvas(data || [])

  }


  async function fetchMatches(){

    const {data} = await supabase
      .from("matches")
      .select(`
        *,
        team1:teams!team1_id(nome),
        team2:teams!team2_id(nome)
      `)
      .eq("prova_id",provaId)

    setMatches(data || [])

  }


  async function salvarScore(matchId,score1,score2){

    await supabase
      .from("matches")
      .update({
        score1,
        score2
      })
      .eq("id",matchId)

    fetchMatches()

  }


  const matchesFiltrados = fase
  ? matches.filter(m => m.fase === fase)
  : matches


  return(

    <div className="container mt-4">

      <h2>Árbitro — Playoffs</h2>

      <select
      className="form-select mb-3"
      value={provaId}
      onChange={e=>setProvaId(e.target.value)}
      >

        <option value="">Selecione a prova</option>

        {provas.map(p=>(
          <option key={p.id} value={p.id}>
            {p.nome}
          </option>
        ))}

      </select>


      {provaId && (

        <select
        className="form-select mb-4"
        value={fase}
        onChange={(e)=>setFase(e.target.value)}
        >

          <option value="">Todas as fases</option>
          <option value="oitavas">Oitavas</option>
          <option value="quartas">Quartas</option>
          <option value="semifinal">Semifinal</option>
          <option value="final">Final</option>

        </select>

      )}


      {matchesFiltrados.map(match=>(

        <div key={match.id} className="card mb-3">

          <div className="card-header">

            <strong>{match.fase.toUpperCase()}</strong>

          </div>

          <div className="card-body">

            <div className="row align-items-center">

              <div className="col-md-4">
                {match.team1?.nome}
              </div>

              <div className="col-md-2">

                <input
                type="number"
                defaultValue={match.score1 || ""}
                className="form-control"
                id={`s1-${match.id}`}
                />

              </div>

              <div className="col-md-4">
                {match.team2?.nome}
              </div>

              <div className="col-md-2">

                <input
                type="number"
                defaultValue={match.score2 || ""}
                className="form-control"
                id={`s2-${match.id}`}
                />

              </div>

            </div>

            <button
            className="btn btn-success mt-3"
            onClick={()=>{

              const s1 = document.getElementById(`s1-${match.id}`).value
              const s2 = document.getElementById(`s2-${match.id}`).value

              salvarScore(match.id,s1,s2)

            }}
            >

              Salvar Resultado

            </button>

          </div>

        </div>

      ))}

    </div>

  )

}