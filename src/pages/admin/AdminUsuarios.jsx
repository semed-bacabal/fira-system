import { useEffect, useState } from "react"
import { supabase } from "../../services/supabaseClient"

export default function AdminUsuarios() {

  const [usuarios, setUsuarios] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUsuarios()
  }, [])

  async function fetchUsuarios() {

    try {

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("nome")

      if (error) {
        console.error("Erro ao buscar usuários:", error)
        return
      }

      setUsuarios(data || [])

    } catch (err) {
      console.error("Erro inesperado:", err)
    }

    setLoading(false)
  }

  async function handleUpdate(id, campo, valor) {

    try {

      const { error } = await supabase
        .from("profiles")
        .update({ [campo]: valor })
        .eq("id", id)

      if (error) {
        console.error("Erro ao atualizar:", error)
        alert("Erro ao atualizar usuário")
        return
      }

      fetchUsuarios()

    } catch (err) {
      console.error("Erro inesperado:", err)
    }
  }

  async function deletarUsuario(id) {

    const confirmar = window.confirm("Deseja realmente excluir este usuário?")

    if (!confirmar) return

    try {

      const { error } = await supabase
        .from("profiles")
        .delete()
        .eq("id", id)

      if (error) {
        console.error("Erro ao excluir:", error)
        alert("Erro ao excluir usuário")
        return
      }

      alert("Usuário excluído com sucesso")

      fetchUsuarios()

    } catch (err) {
      console.error("Erro inesperado:", err)
    }
  }

  if (loading) {
    return <p>Carregando usuários...</p>
  }

  return (

    <div>

      <h4>Painel do Administrador</h4>

      <table className="table mt-4">

        <thead>
          <tr>
            <th>Nome</th>
            <th>CPF</th>
            <th>Status</th>
            <th>Role</th>
            <th>Ações</th>
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

              <td>

                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => deletarUsuario(user.id)}
                >
                  Excluir
                </button>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  )
}