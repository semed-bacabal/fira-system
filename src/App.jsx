import { BrowserRouter, Routes, Route } from "react-router-dom"
import Navbar from "./components/Navbar"
import ProtectedRoute from "./components/ProtectedRoute"

import Home from "./pages/Home"
import Register from "./pages/Register"

import EquipeDetalhe from "./pages/tecnico/EquipeDetalhe"
import Admin from "./pages/admin/AdminDashboard"
import Arbitro from "./pages/arbitro/ArbitroDashboard"
import Monitor from "./pages/monitor/MonitorDashboard"
import Tecnico from "./pages/tecnico/TecnicoDashboard"
import ScannerEquipe from "./pages/monitor/ScannerEquipe"
import EquipeDetalheMonitor from "./pages/monitor/EquipeDetalheMonitor"
import ArbitroCategorias from "./pages/arbitro/ArbitroCategorias"
import ArbitroProvas from "./pages/arbitro/ArbitroProvas"
import ArbitroEquipes from "./pages/arbitro/ArbitroEquipes"
import ArbitroAvaliacao from "./pages/arbitro/ArbitroAvaliacao"

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>

        <Route path="/" element={<Home />} />
        <Route path="/cadastro" element={<Register />} />

        <Route
          path="/tecnico/equipe/:id"
          element={
            <ProtectedRoute allowedRoles={["tecnico"]}>
              <EquipeDetalhe />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Admin />
            </ProtectedRoute>
          }
        />

        <Route path="/arbitro" element={<Arbitro />} />

        <Route
          path="/monitor"
          element={
            <ProtectedRoute allowedRoles={["monitor"]}>
              <Monitor />
            </ProtectedRoute>
          }
        />

        <Route
          path="/tecnico"
          element={
            <ProtectedRoute allowedRoles={["tecnico"]}>
              <Tecnico />
            </ProtectedRoute>
          }
        />

        <Route
          path="/monitor/scanner"
          element={
            <ProtectedRoute allowedRoles={["monitor"]}>
              <ScannerEquipe />
            </ProtectedRoute>
          }
        />

        <Route
          path="/monitor/equipe/:id"
          element={
            <ProtectedRoute allowedRoles={["monitor"]}>
              <EquipeDetalheMonitor />
            </ProtectedRoute>
          }
        />

        <Route
          path="/arbitro/categorias/:eventoId"
          element={
            <ProtectedRoute allowedRoles={["arbitro"]}>
              <ArbitroCategorias />
            </ProtectedRoute>
          }
        />

        <Route
          path="/arbitro/provas/:eventoId/:categoriaId"
          element={
            <ProtectedRoute allowedRoles={["arbitro"]}>
              <ArbitroProvas />
            </ProtectedRoute>
          }
        />

        <Route
          path="/arbitro/equipes/:eventoId/:categoriaId/:provaId"
          element={
            <ProtectedRoute allowedRoles={["arbitro"]}>
              <ArbitroEquipes />
            </ProtectedRoute>
          }
        />

        <Route
          path="/arbitro/avaliar/:eventoId/:categoriaId/:provaId/:equipeId"
          element={
            <ProtectedRoute allowedRoles={["arbitro"]}>
              <ArbitroAvaliacao />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App