import { useState } from "react"
import { supabase } from "../services/supabaseClient"
import { useNavigate } from "react-router-dom"

export default function Register() {

  const [nome, setNome] = useState("")
  const [cpf, setCpf] = useState("")
  const [dataNascimento, setDataNascimento] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const handleRegister = async (e) => {
    e.preventDefault()
    setLoading(true)

    // 1️⃣ Criar usuário no Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password
    })

    if (error) {
      console.error("ERRO SIGNUP:", error)
      alert(error.message)
      setLoading(false)
      return
    }

    const user = data.user

    if (!user) {
      alert("Erro ao criar usuário.")
      setLoading(false)
      return
    }

    // 2️⃣ Criar perfil na tabela profiles
    const { error: profileError } = await supabase
   .from("profiles")
   .insert({
      id: user.id,
      nome,
      cpf,
      data_nascimento: dataNascimento,
      role: null,
      status: "pending"
    })

    if (profileError) {
      console.error("ERRO PROFILE:", profileError)
      alert(profileError.message)
      setLoading(false)
      return
    }

    alert("Cadastro realizado com sucesso!")
    navigate("/")
    setLoading(false)
  }

  return (
    <div className="container mt-5">
      <h2>Cadastro</h2>

      <form className="mt-3" onSubmit={handleRegister}>

        <input
          className="form-control mb-2"
          placeholder="Nome completo"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
        />

        <input
          className="form-control mb-2"
          placeholder="CPF"
          value={cpf}
          onChange={(e) => setCpf(e.target.value)}
          required
        />

        <input
          type="date"
          className="form-control mb-2"
          value={dataNascimento}
          onChange={(e) => setDataNascimento(e.target.value)}
          required
        />

        <input
          type="email"
          className="form-control mb-2"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          className="form-control mb-2"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="btn btn-primary w-100"
          disabled={loading}
        >
          {loading ? "Cadastrando..." : "Cadastrar"}
        </button>

      </form>
    </div>
  )
}