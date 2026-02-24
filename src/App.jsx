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

        <Route
          path="/arbitro"
          element={
            <ProtectedRoute allowedRoles={["arbitro"]}>
              <Arbitro />
            </ProtectedRoute>
          }
        />

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

      </Routes>
    </BrowserRouter>
  )
}

export default App