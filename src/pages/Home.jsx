import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../services/supabaseClient"

export default function Home() {

  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [mensagem, setMensagem] = useState("")

  const handleLogin = async (e) => {
    e.preventDefault()

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: senha,
    })

    if (error) {
      setMensagem("Erro ao fazer login: " + error.message)
      return
    }

    const userId = data.user.id

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single()

    if (profileError || !profile) {
      setMensagem("Perfil não encontrado.")
      return
    }

    if (profile.status !== "active") {
      setMensagem("Seu cadastro ainda não foi ativado.")
      return
    }

    // 🔥 REDIRECIONAMENTO POR ROLE
    switch (profile.role) {
      case "admin":
        navigate("/admin")
        break
      case "arbitro":
        navigate("/arbitro")
        break
      case "monitor":
        navigate("/monitor")
        break
      case "tecnico":
        navigate("/tecnico")
        break
      default:
        setMensagem("Role inválida.")
    }
  }

  return (
    <div className="container mt-5">
      <h2>Login</h2>

      <form onSubmit={handleLogin}>
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
          className="form-control mb-3"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
        />

        <button className="btn btn-primary w-100">
          Entrar
        </button>
      </form>

      {mensagem && (
        <div className="alert alert-danger mt-3">
          {mensagem}
        </div>
      )}
    </div>
  )
}