// apps/frontend/src/app/pages/Menu.tsx
import { useEffect, useState } from 'react';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';
import './css/Menu.css';

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
}

interface CartItem extends Product {
  quantity: number;
}

export default function Menu() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [tableNumber, setTableNumber] = useState('');
  const navigate = useNavigate();

  // 1. Cargar productos
  useEffect(() => {
    api.get('/products')
      .then(res => setProducts(res.data))
      .catch(() => alert('Error cargando menú'));
  }, []);

  // 2. Agregar al carrito (agrupar)
  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        // Si ya existe, sumamos 1
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      // Si es nuevo, lo agregamos con cantidad 1
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  // 3. Restar del carrito
  const removeFromCart = (id: string) => {
    setCart(prev => prev.reduce((acc, item) => {
      if (item.id === id) {
        if (item.quantity > 1) {
          acc.push({ ...item, quantity: item.quantity - 1 });
        }
        // Si llega a 0, no lo agregamos (se borra)
      } else {
        acc.push(item);
      }
      return acc;
    }, [] as CartItem[]));
  };

  // 4. Enviar Pedido a Cocina
  const handleSendOrder = async () => {
    if (!tableNumber) return alert('¡Falta el número de mesa!');
    if (cart.length === 0) return alert('El carrito está vacío');

    try {
      const orderPayload = {
        tableNumber: parseInt(tableNumber),
        items: cart.map(item => ({
          productId: item.id,
          quantity: item.quantity
        }))
      };

      await api.post('/orders', orderPayload);
      
      alert('¡Pedido enviado a cocina! 👨‍🍳');
      setCart([]); // Limpiar carrito
      setTableNumber('');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error al enviar pedido');
    }
  };

  // Calcular Total
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const getEmoji = (cat: string) => {
    switch(cat.toLowerCase()) {
      case 'bebida': return '🥤';
      case 'fondo': return '🍔';
      case 'postre': return '🍰';
      default: return '🍽️';
    }
  };

  return (
    <div className="menu-container">
      {/* IZQUIERDA: CARTA DE PRODUCTOS */}
      <div className="menu-grid">
        {products.map(p => (
          <div key={p.id} className="product-card" onClick={() => addToCart(p)}>
            <span className="emoji-icon">{getEmoji(p.category)}</span>
            <h3>{p.name}</h3>
            <span className="price-tag">${p.price.toLocaleString()}</span>
          </div>
        ))}
      </div>

      {/* DERECHA: COMANDA */}
      <div className="order-sidebar">
        <div className="sidebar-header">
          <h2>📝 Comanda</h2>
          <input 
            type="number" 
            placeholder="N° Mesa" 
            className="table-input"
            value={tableNumber}
            onChange={e => setTableNumber(e.target.value)}
          />
        </div>

        <div className="order-items">
          {cart.map(item => (
            <div key={item.id} className="order-item">
              <div>
                <strong>{item.name}</strong>
                <br/>
                <small>${item.price}</small>
              </div>
              <div className="qty-controls">
                <button onClick={() => removeFromCart(item.id)}>-</button>
                <span>{item.quantity}</span>
                <button onClick={() => addToCart(item)}>+</button>
              </div>
            </div>
          ))}
          {cart.length === 0 && <p style={{color: '#999', textAlign:'center'}}>Selecciona platos del menú...</p>}
        </div>

        <div className="total-section">
          <div className="total-row">
            <span>Total:</span>
            <span>${total.toLocaleString()}</span>
          </div>
          <button 
            className="send-btn" 
            onClick={handleSendOrder}
            disabled={cart.length === 0 || !tableNumber}
          >
            CONFIRMAR PEDIDO
          </button>
          
          <div className="logout-link" onClick={() => {
            localStorage.clear();
            navigate('/login');
          }}>
            Cerrar Sesión
          </div>
        </div>
      </div>
    </div>
  );
}