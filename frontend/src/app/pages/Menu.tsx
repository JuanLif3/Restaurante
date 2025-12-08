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

  useEffect(() => {
    api.get('/products')
      .then(res => setProducts(res.data))
      .catch(() => alert('Error cargando la carta.'));
  }, []);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.reduce((acc, item) => {
      if (item.id === id) {
        if (item.quantity > 1) {
          acc.push({ ...item, quantity: item.quantity - 1 });
        }
      } else {
        acc.push(item);
      }
      return acc;
    }, [] as CartItem[]));
  };

  const handleSendOrder = async () => {
    if (!tableNumber) return alert('Por favor, indique el número de mesa.');
    if (cart.length === 0) return alert('La comanda está vacía.');

    try {
      const orderPayload = {
        tableNumber: parseInt(tableNumber),
        items: cart.map(item => ({
          productId: item.id,
          quantity: item.quantity
        }))
      };

      await api.post('/orders', orderPayload);
      
      // Mensaje más elegante
      alert('🍸 Pedido confirmado. Enviado a cocina.');
      setCart([]);
      setTableNumber('');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error al procesar el pedido.');
    }
  };

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Emojis refinados para el estilo elegante
  const getEmoji = (cat: string) => {
    switch(cat.toLowerCase()) {
      case 'bebida': return '🥂'; // Copas en vez de vaso plástico
      case 'fondo': return '🍲';
      case 'entrada': return '🥗';
      case 'postre': return '🍰';
      default: return '🍽️';
    }
  };

  return (
    <div className="menu-container">
      {/* IZQUIERDA: CARTA */}
      <div className="menu-grid">
        {/* Podrías poner un título aquí si quisieras */}
        <div style={{gridColumn: '1/-1', marginBottom: '10px'}}>
           <h1 style={{fontFamily: 'Playfair Display', color: '#d4af37', fontSize: '32px'}}>Nuestra Carta</h1>
           <p style={{color: '#aab3b0'}}>Seleccione los platos para agregar a la comanda</p>
        </div>

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
          <h2>Comanda</h2>
          <input 
            type="number" 
            placeholder="N° MESA" 
            className="table-input"
            value={tableNumber}
            onChange={e => setTableNumber(e.target.value)}
          />
        </div>

        <div className="order-items">
          {cart.map(item => (
            <div key={item.id} className="order-item">
              <div className="item-info">
                <strong>{item.name}</strong>
                <br/>
                <small>${item.price.toLocaleString()}</small>
              </div>
              <div className="qty-controls">
                <button onClick={() => removeFromCart(item.id)}>-</button>
                <span>{item.quantity}</span>
                <button onClick={() => addToCart(item)}>+</button>
              </div>
            </div>
          ))}
          {cart.length === 0 && (
            <p style={{color: '#555', textAlign:'center', marginTop: '20px', fontStyle: 'italic'}}>
              La comanda está vacía
            </p>
          )}
        </div>

        <div className="total-section">
          <div className="total-row">
            <span>Total</span>
            <span>${total.toLocaleString()}</span>
          </div>
          <button 
            className="send-btn" 
            onClick={handleSendOrder}
            disabled={cart.length === 0 || !tableNumber}
          >
            Confirmar Pedido
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