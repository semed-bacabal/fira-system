import { useEffect, useState } from "react"
import { Navigate } from "react-router-dom"
import { supabase } from "../services/supabaseClient"

export default function ProtectedRoute({ children, allowedRoles }) {

  const [loading, setLoading] = useState(true)
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {

    const checkAccess = async () => {

      const { data } = await supabase.auth.getSession()
      const user = data.session?.user

      if (!user) {
        setAuthorized(false)
        setLoading(false)
        return
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("role, status")
        .eq("id", user.id)
        .single()

      if (!profile || profile.status !== "active") {
        setAuthorized(false)
        setLoading(false)
        return
      }

      if (allowedRoles.includes(profile.role)) {
        setAuthorized(true)
      } else {
        setAuthorized(false)
      }

      setLoading(false)
    }

    checkAccess()

  }, [])

  if (loading) return null

  if (!authorized) return <Navigate to="/" replace />

  return children
}