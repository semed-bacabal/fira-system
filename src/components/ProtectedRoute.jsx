import { useEffect, useState } from "react"
import { Navigate } from "react-router-dom"
import { supabase } from "../services/supabaseClient"

export default function ProtectedRoute({ children, allowedRoles }) {

  const [authorized, setAuthorized] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {

    const checkAccess = async () => {
      try {

        const { data: sessionData } = await supabase.auth.getSession()
        const user = sessionData.session?.user

        if (!user) {
          setAuthorized(false)
          return
        }

        const { data: profile, error } = await supabase
          .from("profiles")
          .select("role, status")
          .eq("id", user.id)
          .single()

        if (error || !profile) {
          setAuthorized(false)
          return
        }

        if (profile.status !== "active") {
          setAuthorized(false)
          return
        }

        if (allowedRoles.includes(profile.role)) {
          setAuthorized(true)
        } else {
          setAuthorized(false)
        }

      } catch (err) {
        console.error("Erro no ProtectedRoute:", err)
        setAuthorized(false)
      } finally {
        setLoading(false)
      }
    }

    checkAccess()

  }, [allowedRoles])

  // 🔄 Loading visível (nunca mais tela branca)
  if (loading) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <h4>Verificando acesso...</h4>
      </div>
    )
  }

  if (!authorized) {
    return <Navigate to="/" replace />
  }

  return children
}