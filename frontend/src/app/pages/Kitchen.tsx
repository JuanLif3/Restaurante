// apps/frontend/src/app/pages/Kitchen.tsx
import { useEffect, useState } from 'react';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';
import './css/Kitchen.css';

interface OrderItem {
  id: string;
  quantity: number;
  product: {
    name: string;
  };
}

interface Order {
  id: string;
  tableNumber: number;
  status: string;
  createdAt: string;
  items: OrderItem[];
}

export default function Kitchen() {
  const [orders, setOrders] = useState<Order[]>([]);
  const navigate = useNavigate();

  // 1. Cargar Pedidos Pendientes
  const loadOrders = async () => {
    try {
      const { data } = await api.get('/orders/kitchen');
      setOrders(data);
    } catch (error) {
      console.error('Error cargando cocina', error);
      // No redirigimos al login tan agresivamente por si es un fallo de red temporal
    }
  };

  useEffect(() => {
    loadOrders();
    
    // Auto-refresco cada 10 segundos (Polling simple)
    const interval = setInterval(loadOrders, 10000);
    return () => clearInterval(interval);
  }, []);

  // 2. Marcar como LISTO
  const handleOrderReady = async (id: string) => {
    if (!window.confirm('¿Pedido completado?')) return;
    try {
      await api.patch(`/orders/${id}/status`, { status: 'ready' });
      // Quitamos el pedido de la lista visualmente rápido
      setOrders(prev => prev.filter(o => o.id !== id));
      alert('¡Pedido despachado! ✅');
    } catch (error) {
      alert('Error al actualizar estado');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="kitchen-container">
      <div className="kitchen-header">
        <h1>👨‍🍳 Comandas de Cocina</h1>
        <div>
          <button onClick={loadOrders} className="refresh-btn" style={{marginRight: '10px'}}>🔄 Actualizar</button>
          <button onClick={handleLogout} className="refresh-btn" style={{backgroundColor: '#c0392b'}}>Salir</button>
        </div>
      </div>

      <div className="orders-grid">
        {orders.map((order) => (
          <div key={order.id} className="order-card">
            <div className="order-header">
              <span>Mesa #{order.tableNumber}</span>
              <span className="time-ago">
                {new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </span>
            </div>
            
            <div className="order-body">
              <ul>
                {order.items.map((item) => (
                  <li key={item.id}>
                    <span className="qty">{item.quantity}x</span> 
                    {item.product.name}
                  </li>
                ))}
              </ul>
            </div>

            <div className="order-footer">
              <button 
                className="ready-btn"
                onClick={() => handleOrderReady(order.id)}
              >
                ✅ ¡LISTO!
              </button>
            </div>
          </div>
        ))}

        {orders.length === 0 && (
          <div className="empty-message">
            <h2>🎉 No hay pedidos pendientes</h2>
            <p>La cocina está tranquila... por ahora.</p>
          </div>
        )}
      </div>
    </div>
  );
}