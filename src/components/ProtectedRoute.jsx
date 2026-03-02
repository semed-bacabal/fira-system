import { useEffect, useState } from "react"
import { Navigate } from "react-router-dom"
import { supabase } from "../services/supabaseClient"

export default function ProtectedRoute({ children, allowedRoles }) {

  const [authorized, setAuthorized] = useState(null)

  useEffect(() => {

    const checkAccess = async () => {

      const { data } = await supabase.auth.getSession()
      const user = data.session?.user

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

      // 🔒 Mantém sua regra de status
      if (profile.status !== "active") {
        setAuthorized(false)
        return
      }

      // 🔒 Mantém sua regra de roles
      if (allowedRoles.includes(profile.role)) {
        setAuthorized(true)
      } else {
        setAuthorized(false)
      }
    }

    checkAccess()

  }, [allowedRoles])

  // Enquanto verifica sessão
  if (authorized === null) return null

  // Se não autorizado
  if (!authorized) return <Navigate to="/" replace />

  return children
}