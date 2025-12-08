import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Inventory from './pages/Inventory'; // <--- 1. IMPORTA TU NUEVO COMPONENTE

// Placeholders (Cocina y Menú siguen pendientes)
const Menu = () => <h1>🍔 Menú para Clientes (Próximamente)</h1>;
const Kitchen = () => <h1>👨‍🍳 Pantalla de Cocina (Próximamente)</h1>;
const Finances = () => <h1>💰 Reporte Financiero (Próximamente)</h1>;

export function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      
      {/* Rutas */}
      <Route path="/menu" element={<Menu />} />
      <Route path="/kitchen" element={<Kitchen />} />
      
      {/* 2. REEMPLAZA EL COMPONENTE INVENTORY AQUÍ: */}
      <Route path="/inventory" element={<Inventory />} /> 
      
      <Route path="/finances" element={<Finances />} />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;