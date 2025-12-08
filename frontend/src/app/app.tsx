import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Inventory from './pages/Inventory';
import Menu from './pages/Menu';
import Kitchen from './pages/Kitchen';
import Finances from './pages/Finances'; // <--- 1. IMPORTAR

export function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/menu" element={<Menu />} />
      <Route path="/kitchen" element={<Kitchen />} />
      <Route path="/inventory" element={<Inventory />} />
      
      {/* 2. REEMPLAZAR AQUÍ */}
      <Route path="/finances" element={<Finances />} />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;