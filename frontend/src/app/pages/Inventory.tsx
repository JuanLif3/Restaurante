// apps/frontend/src/app/pages/Inventory.tsx
import { useEffect, useState } from 'react';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';
import './css/Inventory.css';

export default function Inventory() {
  const [products, setProducts] = useState<any[]>([]);
  const navigate = useNavigate();

  // Estados para el formulario
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [category, setCategory] = useState('Fondo');

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const { data } = await api.get('/products');
      setProducts(data);
    } catch (error) {
      alert('Sesión expirada o error de conexión.');
      navigate('/login');
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !stock) return;

    try {
      await api.post('/products', {
        name,
        price: parseInt(price),
        stock: parseInt(stock),
        category,
      });
      
      setName('');
      setPrice('');
      setStock('');
      loadProducts();
      // Un feedback sutil podría ir aquí
    } catch (error) {
      alert('No se pudo crear el producto.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Desea retirar este producto del inventario?')) return;
    try {
      await api.delete(`/products/${id}`);
      loadProducts();
    } catch (error) {
      alert('Error al eliminar.');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="inventory-container">
      <div className="header-section">
        <div>
          <h1>Control de Bodega</h1>
          <p style={{color: '#aab3b0', marginTop: '5px', fontSize: '14px'}}>Gestión de insumos y carta</p>
        </div>
        <button onClick={handleLogout} className="logout-btn">Cerrar Sesión</button>
      </div>

      {/* Formulario de Ingreso */}
      <form onSubmit={handleCreate} className="product-form">
        <div className="form-group">
          <label>Producto</label>
          <input 
            className="form-input" 
            value={name} 
            onChange={e => setName(e.target.value)} 
            placeholder="Nombre del plato..." 
            required 
          />
        </div>
        
        <div className="form-group">
          <label>Precio ($)</label>
          <input 
            type="number" 
            className="form-input" 
            value={price} 
            onChange={e => setPrice(e.target.value)} 
            placeholder="0" 
            required 
          />
        </div>

        <div className="form-group">
          <label>Stock</label>
          <input 
            type="number" 
            className="form-input" 
            value={stock} 
            onChange={e => setStock(e.target.value)} 
            placeholder="0" 
            required 
          />
        </div>

        <div className="form-group">
          <label>Categoría</label>
          <select 
            className="form-input" 
            value={category} 
            onChange={e => setCategory(e.target.value)}
            style={{cursor: 'pointer'}}
          >
            <option value="Fondo">Plato de Fondo</option>
            <option value="Entrada">Entrada</option>
            <option value="Postre">Postre</option>
            <option value="Bebida">Bebida</option>
            <option value="Extra">Extra</option>
          </select>
        </div>

        <button type="submit" className="add-btn">Ingresar</button>
      </form>

      {/* Tabla de Resultados */}
      <table className="inventory-table">
        <thead>
          <tr>
            <th>Item</th>
            <th>Categoría</th>
            <th>Precio Unit.</th>
            <th>Existencias</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td style={{fontWeight: '500', color: '#d4af37'}}>{p.name}</td>
              <td>{p.category}</td>
              <td>${p.price.toLocaleString()}</td>
              <td>
                <span className={`stock-badge ${p.stock < 10 ? 'low-stock' : ''}`}>
                  {p.stock} un.
                </span>
              </td>
              <td>
                <button onClick={() => handleDelete(p.id)} className="delete-btn">Retirar</button>
              </td>
            </tr>
          ))}
          {products.length === 0 && (
            <tr>
              <td colSpan={5} style={{textAlign: 'center', padding: '40px', color: '#666', fontStyle: 'italic'}}>
                El inventario está vacío actualmente.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}