import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { supabase } from "../services/supabaseClient"

export default function Navbar() {

  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {

    const fetchUser = async () => {
      const { data } = await supabase.auth.getSession()
      const currentUser = data.session?.user ?? null

      setUser(currentUser)

      if (currentUser) {
        const { data: profileData } = await supabase
          .from("profiles")
          .select("nome, role")
          .eq("id", currentUser.id)
          .single()

        setProfile(profileData)
      }
    }

    fetchUser()

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const currentUser = session?.user ?? null
        setUser(currentUser)

        if (currentUser) {
          const { data: profileData } = await supabase
            .from("profiles")
            .select("nome, role")
            .eq("id", currentUser.id)
            .single()

          setProfile(profileData)
        } else {
          setProfile(null)
        }
      }
    )

    return () => {
      listener.subscription.unsubscribe()
    }

  }, [])

  const handleLogout = async () => {
  const { error } = await supabase.auth.signOut()

  if (!error) {
    setUser(null)
    setProfile(null)
    navigate("/", { replace: true })
  }
}

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
      <Link to="/" className="navbar-brand fw-bold">
        FIRA
      </Link>

      <div className="ms-auto d-flex align-items-center gap-3">

        {!user ? (
          <>
            <Link to="/" className="btn btn-outline-light">
              Login
            </Link>
            <Link to="/" className="btn btn-warning">
              Cadastro
            </Link>
          </>
        ) : (
          <>
            <span className="text-white">
              Olá, <strong>{profile?.nome}</strong>
              {" "}
              <span className="badge bg-info text-dark ms-2">
                {profile?.role?.toUpperCase()}
              </span>
            </span>

            <button
              onClick={handleLogout}
              className="btn btn-danger"
            >
              Logout
            </button>
          </>
        )}

      </div>
    </nav>
  )
}