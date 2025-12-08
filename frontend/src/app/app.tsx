import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Inventory from './pages/Inventory';
import Menu from './pages/Menu';
import Kitchen from './pages/Kitchen';
import Finances from './pages/Finances';
import { ProtectedRoute } from './utils/ProtectedRoute'; // <--- Importamos el guardia

export function App() {
  return (
    <Routes>
      {/* Ruta Pública */}
      <Route path="/login" element={<Login />} />

      {/* 🛡️ ZONA DE CLIENTES (Y Admin) */}
      <Route element={<ProtectedRoute allowedRoles={['cliente']} />}>
        <Route path="/menu" element={<Menu />} />
      </Route>

      {/* 🛡️ ZONA DE BODEGA (Y Admin) */}
      <Route element={<ProtectedRoute allowedRoles={['bodega']} />}>
        <Route path="/inventory" element={<Inventory />} />
      </Route>

      {/* 🛡️ ZONA DE COCINA (Y Admin) */}
      <Route element={<ProtectedRoute allowedRoles={['cocina']} />}>
        <Route path="/kitchen" element={<Kitchen />} />
      </Route>

      {/* 🛡️ ZONA DE FINANZAS (Y Admin) */}
      <Route element={<ProtectedRoute allowedRoles={['finanzas']} />}>
        <Route path="/finances" element={<Finances />} />
      </Route>

      {/* Cualquier ruta desconocida -> Al login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;