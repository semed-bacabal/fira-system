import { useEffect, useState } from "react"
import { supabase } from "../../services/supabaseClient"

export default function AdminDashboard() {

  const [usuarios, setUsuarios] = useState([])

  useEffect(() => {
    fetchUsuarios()
  }, [])

  const fetchUsuarios = async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")

    if (!error) {
      setUsuarios(data)
    }
  }

  const handleUpdate = async (id, campo, valor) => {
    await supabase
      .from("profiles")
      .update({ [campo]: valor })
      .eq("id", id)

    fetchUsuarios()
  }

  return (
    <div className="container mt-5">
      <h2>Painel do Administrador</h2>

      <table className="table mt-4">
        <thead>
          <tr>
            <th>Nome</th>
            <th>CPF</th>
            <th>Status</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((user) => (
            <tr key={user.id}>
              <td>{user.nome}</td>
              <td>{user.cpf}</td>

              <td>
                <select
                  className="form-select"
                  value={user.status}
                  onChange={(e) =>
                    handleUpdate(user.id, "status", e.target.value)
                  }
                >
                  <option value="pending">pending</option>
                  <option value="active">active</option>
                  <option value="inactive">inactive</option>
                </select>
              </td>

              <td>
                <select
                  className="form-select"
                  value={user.role}
                  onChange={(e) =>
                    handleUpdate(user.id, "role", e.target.value)
                  }
                >
                  <option value="admin">admin</option>
                  <option value="arbitro">arbitro</option>
                  <option value="monitor">monitor</option>
                  <option value="tecnico">tecnico</option>
                </select>
              </td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}