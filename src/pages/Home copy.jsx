import { Link } from "react-router-dom"

export default function Home() {
  return (
    <div className="container mt-5">

      <div className="text-center mb-5">
        <h1>FIRA - Sistema Oficial</h1>
        <p>Cadastro de Árbitros, Monitores e Técnicos</p>
      </div>

      <div className="row">

        {/* LOGIN */}
        <div className="col-md-6">
          <div className="card p-4 shadow-sm">
            <h3 className="mb-3">Login</h3>

            <button className="btn btn-danger w-100 mb-3">
              Entrar com Google
            </button>

            <form>
              <input 
                type="email" 
                className="form-control mb-2" 
                placeholder="Email"
              />
              <input 
                type="password" 
                className="form-control mb-3" 
                placeholder="Senha"
              />
              <button className="btn btn-primary w-100">
                Entrar
              </button>
            </form>
          </div>
        </div>

        {/* CADASTRO */}
        <div className="col-md-6">
          <div className="card p-4 shadow-sm">
            <h3 className="mb-3">Cadastro</h3>

            <button className="btn btn-danger w-100 mb-3">
              Cadastrar com Google
            </button>

            <form>
              <input 
                className="form-control mb-2" 
                placeholder="Nome completo"
              />
              <input 
                className="form-control mb-2" 
                placeholder="CPF"
              />
              <input 
                type="date"
                className="form-control mb-2"
              />
              <input 
                type="email" 
                className="form-control mb-2" 
                placeholder="Email"
              />
              <input 
                type="password" 
                className="form-control mb-3" 
                placeholder="Senha"
              />
              <button className="btn btn-success w-100">
                Cadastrar
              </button>
            </form>

          </div>
        </div>

      </div>
    </div>
  )
}