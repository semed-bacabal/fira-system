export default function Register() {
  return (
    <div className="container mt-5">
      <h2>Cadastro</h2>
      <form className="mt-3">
        <input className="form-control mb-2" placeholder="Nome completo" />
        <input className="form-control mb-2" placeholder="CPF" />
        <input type="date" className="form-control mb-2" />
        <input type="email" className="form-control mb-2" placeholder="Email" />
        <input type="password" className="form-control mb-2" placeholder="Senha" />
        <button className="btn btn-primary w-100">
          Cadastrar
        </button>
      </form>
    </div>
  )
}