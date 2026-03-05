import { useState } from "react"

import AdminUsuarios from "./AdminUsuarios"
import AdminEventos from "./AdminEventos"
import AdminCategorias from "./AdminCategorias"
import AdminEquipes from "./AdminEquipes"
import AdminProvas from "./AdminProvas"
import AdminGerenciarGrupos from "./AdminGerenciarGrupos"
import AdminGerenciarPlayoffs from "./AdminGerenciarPlayoffs"
import AdminGrupos from "./AdminGrupos"

export default function AdminDashboard() {

  const [pagina, setPagina] = useState("eventos")

  const botaoClasse = (nomePagina) =>
    `btn ${pagina === nomePagina ? "btn-primary" : "btn-secondary"}`

  return (

    <div className="container mt-4">

      <h2>Painel Administrativo</h2>

      <div className="d-flex gap-2 mt-4 mb-4 flex-wrap">

        <button
          className={botaoClasse("eventos")}
          onClick={() => setPagina("eventos")}
        >
          Eventos
        </button>

        <button
          className={botaoClasse("categorias")}
          onClick={() => setPagina("categorias")}
        >
          Categorias
        </button>

        <button
          className={botaoClasse("equipes")}
          onClick={() => setPagina("equipes")}
        >
          Equipes
        </button>

        <button
          className={botaoClasse("provas")}
          onClick={() => setPagina("provas")}admin
        >
          Provas
        </button>

        <button
          className={botaoClasse("grupos")}
          onClick={() => setPagina("grupos")}
        >
          Grupos
        </button>

        <button
          className={botaoClasse("gerenciarGrupos")}
          onClick={()=>setPagina("gerenciarGrupos")}
        >
          Gerenciar Grupos
        </button>

        <button
          className={botaoClasse("gerenciarPlayoffs")}
          onClick={()=>setPagina("gerenciarPlayoffs")}
        >
          Gerenciar Playoffs
        </button>

        <button
          className={botaoClasse("usuarios")}
          onClick={() => setPagina("usuarios")}
        >
          Usuários
        </button>

      </div>

      {pagina === "eventos" && <AdminEventos />}
      {pagina === "categorias" && <AdminCategorias />}
      {pagina === "equipes" && <AdminEquipes />}
      {pagina === "provas" && <AdminProvas />}
      {pagina === "grupos" && <AdminGrupos />}
      {pagina === "gerenciarGrupos" && <AdminGerenciarGrupos />}
      {pagina === "gerenciarPlayoffs" && <AdminGerenciarPlayoffs />}
      {pagina === "usuarios" && <AdminUsuarios />}

    </div>
  )
}