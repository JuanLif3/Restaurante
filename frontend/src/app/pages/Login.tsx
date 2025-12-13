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
      
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Redirección inteligente
      switch(data.user.role) {
        case 'cocina': navigate('/kitchen'); break;
        case 'bodega': navigate('/inventory'); break;
        case 'finanzas': navigate('/finances'); break;
        default: navigate('/menu'); 
      }
      
    } catch (err: any) {
      setError('Credenciales no válidas. Verifique sus datos.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="brand-section">
          {/* Aquí podrías poner un logo <img> si tuvieras uno */}
          <h1 className="login-title">Le Restaurant</h1>
          <p className="login-subtitle">Gestión Gastronómica Integral</p>
        </div>
        
        {error && <div className="error-msg">⚠️ {error}</div>}
        
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label">Correo Electrónico</label>
            <input 
              type="email" 
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="ejemplo@restaurante.com"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Contraseña</label>
            <input 
              type="password" 
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </div>

          

          <button type="submit" className="login-btn">INICIAR SESIÓN</button>

          <div style={{marginTop: '20px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '15px'}}>
  <p style={{fontSize: '13px', color: '#aab3b0', marginBottom: '10px'}}>¿Eres nuevo aquí?</p>
  <button 
    onClick={() => navigate('/register')} 
    style={{
      background: 'transparent',
      border: '1px solid #d4af37',
      color: '#d4af37',
      padding: '8px 20px',
      borderRadius: '20px',
      cursor: 'pointer',
      fontSize: '12px',
      fontWeight: 'bold',
      textTransform: 'uppercase'
    }}
  >
    Crear Nueva Cuenta
  </button>
</div>
        </form>

        <div className="footer-text">
          © 2025 Le Restaurant System. Todos los derechos reservados.
        </div>
      </div>
    </div>
  );
}