import { useNavigate } from "react-router-dom"

export default function MonitorDashboard() {

  const navigate = useNavigate()

  return (
    <div className="container mt-5">
      <h2>Painel do Monitor</h2>

      <button
        className="btn btn-success"
        onClick={() => navigate("/monitor/scanner")}
      >
        Verificar Equipe
      </button>
    </div>
  )
}