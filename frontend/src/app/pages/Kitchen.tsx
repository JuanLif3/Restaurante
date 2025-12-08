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

  const loadOrders = async () => {
    try {
      const { data } = await api.get('/orders/kitchen');
      setOrders(data);
    } catch (error) {
      console.error('Conexión perdida con el servidor.');
    }
  };

  useEffect(() => {
    loadOrders();
    const interval = setInterval(loadOrders, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleOrderReady = async (id: string) => {
    // Usamos un confirm nativo pero podrías hacer un modal elegante después
    if (!window.confirm('¿Confirmar que el pedido está listo para servir?')) return;
    
    try {
      await api.patch(`/orders/${id}/status`, { status: 'ready' });
      setOrders(prev => prev.filter(o => o.id !== id));
    } catch (error) {
      alert('No se pudo actualizar el estado.');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="kitchen-container">
      <div className="kitchen-header">
        <div>
          <h1>Chef Executive</h1>
          <p style={{color: '#aab3b0', margin: '5px 0 0', fontSize: '13px'}}>
            Monitor de Comandas en Tiempo Real
          </p>
        </div>
        <div className="header-actions">
          <button onClick={loadOrders} className="action-btn">
            ↻ Actualizar
          </button>
          <button onClick={handleLogout} className="action-btn logout-btn">
            Salir
          </button>
        </div>
      </div>

      <div className="orders-grid">
        {orders.map((order) => (
          <div key={order.id} className="order-card">
            <div className="order-header">
              <div className="table-info">
                <h3>Mesa {order.tableNumber}</h3>
              </div>
              <div className="time-badge">
                {new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </div>
            </div>
            
            <div className="order-body">
              <ul>
                {order.items.map((item) => (
                  <li key={item.id}>
                    <span className="qty-badge">{item.quantity}</span> 
                    <span>{item.product.name}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="order-footer">
              <button 
                className="ready-btn"
                onClick={() => handleOrderReady(order.id)}
              >
                Despachar
              </button>
            </div>
          </div>
        ))}

        {orders.length === 0 && (
          <div className="empty-message">
            <h2>Sin Pendientes</h2>
            <p>Todo en orden, Chef.</p>
          </div>
        )}
      </div>
    </div>
  );
}