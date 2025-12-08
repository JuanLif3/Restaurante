import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Inventory from './pages/Inventory';
import Menu from './pages/Menu'; // <--- 1. IMPORTAR

// Placeholder (Solo falta Cocina)
const Kitchen = () => <h1>👨‍🍳 Pantalla de Cocina (Próximamente)</h1>;
const Finances = () => <h1>💰 Reporte Financiero (Próximamente)</h1>;

export function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      
      {/* 2. REEMPLAZAR AQUÍ */}
      <Route path="/menu" element={<Menu />} /> 
      
      <Route path="/kitchen" element={<Kitchen />} />
      <Route path="/inventory" element={<Inventory />} />
      <Route path="/finances" element={<Finances />} />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;