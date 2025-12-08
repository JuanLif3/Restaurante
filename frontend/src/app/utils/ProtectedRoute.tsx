// apps/frontend/src/app/utils/ProtectedRoute.tsx
import { Navigate, Outlet } from 'react-router-dom';

interface Props {
  allowedRoles: string[];
}

export const ProtectedRoute = ({ allowedRoles }: Props) => {
  // 1. Leer usuario del almacenamiento local
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;
  const token = localStorage.getItem('token');

  // 2. Verificaciones de Seguridad
  
  // A. Si no hay token o no hay usuario -> Fuera
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // B. Si el rol del usuario NO está en la lista permitida -> Fuera
  // (Nota: Agregamos 'admin' siempre para que tú, el jefe, puedas ver todo si quieres)
  if (!allowedRoles.includes(user.role) && user.role !== 'admin') {
    // Si intenta entrar a bodega siendo cliente, lo mandamos al login
    // o podrías mandarlo a su página de inicio correcta.
    return <Navigate to="/login" replace />;
  }

  // 3. Si pasó todas las pruebas -> Renderizar la página (Outlet)
  return <Outlet />;
};