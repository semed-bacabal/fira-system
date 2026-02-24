import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { supabase } from "../../services/supabaseClient"
import { QRCodeSVG } from "qrcode.react"

export default function EquipeDetalhe() {

  const { id } = useParams()
  const [equipe, setEquipe] = useState(null)
  const [membros, setMembros] = useState([])
  const [nome, setNome] = useState("")
  const [cpf, setCpf] = useState("")
  const [dataNascimento, setDataNascimento] = useState("")
  const [foto, setFoto] = useState(null) // ✅ NOVO STATE
  const [mensagem, setMensagem] = useState("")

  useEffect(() => {
    fetchEquipe()
    fetchMembros()
  }, [])

  const fetchEquipe = async () => {
    const { data } = await supabase
      .from("teams")
      .select("*")
      .eq("id", id)
      .single()

    setEquipe(data)
  }

  const fetchMembros = async () => {
    const { data } = await supabase
      .from("team_members")
      .select("*")
      .eq("team_id", id)
      .order("created_at", { ascending: false })

    setMembros(data || [])
  }

  const adicionarMembro = async (e) => {
    e.preventDefault()

    if (membros.length >= 4) {
      setMensagem("Limite máximo de 4 participantes atingido.")
      return
    }

    if (!nome || !cpf || !dataNascimento || !foto) {
      setMensagem("Preencha todos os campos e selecione a foto.")
      return
    }

    // 🔹 Upload da foto para o Storage
    const fileName = `${id}-${Date.now()}-${foto.name}`

    const { error: uploadError } = await supabase.storage
      .from("team-participantes")
      .upload(fileName, foto)

    if (uploadError) {
      setMensagem("Erro ao enviar foto.")
      return
    }

    const { data: publicUrlData } = supabase.storage
      .from("team-participantes")
      .getPublicUrl(fileName)

    const { error } = await supabase
      .from("team_members")
      .insert([
        {
          team_id: id,
          nome,
          cpf,
          data_nascimento: dataNascimento,
          foto_url: publicUrlData.publicUrl // ✅ SALVA URL
        }
      ])

    if (error) {
      setMensagem("Erro ao adicionar participante.")
      return
    }

    setMensagem("Participante adicionado!")
    setNome("")
    setCpf("")
    setDataNascimento("")
    setFoto(null)
    fetchMembros()
  }

  const finalizarInscricao = async () => {

    if (membros.length < 1) {
      setMensagem("Cadastre pelo menos 1 participante.")
      return
    }

    const { error } = await supabase
      .from("teams")
      .update({ status: "submitted" })
      .eq("id", id)

    if (error) {
      setMensagem("Erro ao finalizar inscrição.")
      return
    }

    setMensagem("Inscrição finalizada com sucesso!")
    fetchEquipe()
  }

  if (!equipe) return <div className="container mt-5">Carregando...</div>

  return (
    <div className="container mt-5">

      <h2>{equipe.nome}</h2>
      <p><strong>Evento:</strong> {equipe.categoria}</p>

      {equipe.status === "submitted" && (
        <div className="alert alert-success mt-3">
          Inscrição Finalizada — Aguardando validação do Monitor
        </div>
      )}

      {equipe.status === "approved" && (
        <div className="alert alert-primary mt-3">
          Equipe Validada pelo Monitor
        </div>
      )}
      
      {/* QR CODE DA EQUIPE */}
      {equipe.qr_token && (
  <div className="card p-4 mb-4 text-center shadow-sm">
    <h5>QR Code da Equipe</h5>

        <QRCodeSVG
          value={`${window.location.origin}/monitor/${equipe.qr_token}`}
          size={180}
        />

    <p className="mt-3 text-muted">
      Apresente este QR Code ao Monitor para validação
    </p>
  </div>
)}

      <hr />

      <h4>Participantes ({membros.length}/4)</h4>

      {equipe.status !== "approved" && (
        <form onSubmit={adicionarMembro} className="card p-3 mb-4">
          <input
            className="form-control mb-2"
            placeholder="Nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />

          <input
            className="form-control mb-2"
            placeholder="CPF"
            value={cpf}
            onChange={(e) => setCpf(e.target.value)}
          />

          <input
            type="date"
            className="form-control mb-2"
            value={dataNascimento}
            onChange={(e) => setDataNascimento(e.target.value)}
            required
          />

          {/* ✅ INPUT DE FOTO ADICIONADO */}
          <input
            type="file"
            className="form-control mb-2"
            accept="image/*"
            onChange={(e) => setFoto(e.target.files[0])}
          />

          <button className="btn btn-success">
            Adicionar Participante
          </button>
        </form>
      )}

      {mensagem && (
        <div className="alert alert-info">
          {mensagem}
        </div>
      )}

      {membros.length === 0 ? (
        <p>Nenhum participante cadastrado ainda.</p>
      ) : (
        membros.map((membro) => (
          <div key={membro.id} className="border p-2 mb-2 rounded">
            {membro.foto_url && (
              <img
                src={membro.foto_url}
                alt="Foto"
                width="80"
                className="mb-2 rounded"
              />
            )}
            <strong>{membro.nome}</strong>
            <br />
            CPF: {membro.cpf}
            <br />
            Nascimento: {membro.data_nascimento}
          </div>
        ))
      )}

      {!equipe.validado && membros.length >= 1 && (
        <button
          className="btn btn-danger mt-3"
          onClick={finalizarInscricao}
        >
          Finalizar Inscrição
        </button>
      )}

    </div>
  )
}