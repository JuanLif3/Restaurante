// apps/frontend/src/app/pages/Login.tsx
import { useState } from 'react';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';
import './css/Login.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const { data } = await api.post('/auth/login', { email, password });
      
      // Guardar token y datos del usuario
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Redirigir según el rol (INTELIGENCIA DE NEGOCIO 🧠)
      switch(data.user.role) {
        case 'cocina': navigate('/kitchen'); break;
        case 'bodega': navigate('/inventory'); break;
        case 'finanzas': navigate('/finances'); break;
        default: navigate('/menu'); // Clientes y otros al menú
      }
      
    } catch (err: any) {
      setError('Credenciales incorrectas. Intenta de nuevo.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">🍽️ Acceso Restaurante</h2>
        
        {error && <p className="error-msg">{error}</p>}
        
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email</label>
            <input 
              type="email" 
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="usuario@restaurante.com"
            />
          </div>

          <div className="form-group">
            <label>Contraseña</label>
            <input 
              type="password" 
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••"
            />
          </div>

          <button type="submit" className="login-btn">Ingresar</button>
        </form>
      </div>
    </div>
  );
}