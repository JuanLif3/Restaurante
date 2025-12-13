// apps/frontend/src/app/pages/Register.tsx
import { useState } from 'react';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';
import './css/Register.css';

export default function Register() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // 1. Crear la cuenta (el backend fuerza el rol 'cliente')
      await api.post('/auth/register', {
        fullName,
        email,
        password
      });

      // 2. Éxito
      alert('¡Cuenta creada con éxito! Ahora puedes iniciar sesión.');
      navigate('/login');

    } catch (error) {
      alert('Error al crear cuenta. El correo podría estar en uso.');
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h1 className="register-title">Nueva Cuenta</h1>
        <p className="register-subtitle">Únete al club exclusivo de clientes</p>

        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label className="form-label">Nombre Completo</label>
            <input 
              className="form-input"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              placeholder="Ej: Juan Pérez"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Correo Electrónico</label>
            <input 
              type="email" 
              className="form-input"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="cliente@ejemplo.com"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Contraseña</label>
            <input 
              type="password" 
              className="form-input"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>

          <button type="submit" className="register-btn">Registrarme</button>
        </form>

        <span className="login-link" onClick={() => navigate('/login')}>
          ¿Ya tienes cuenta? Iniciar Sesión
        </span>
      </div>
    </div>
  );
}