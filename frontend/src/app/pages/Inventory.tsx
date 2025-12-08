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
  const [category, setCategory] = useState('Fondo'); // Valor por defecto

  // 1. Cargar productos al iniciar
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const { data } = await api.get('/products');
      setProducts(data);
    } catch (error) {
      alert('Error cargando inventario. ¿Tu sesión expiró?');
      navigate('/login');
    }
  };

  // 2. Crear producto
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
      
      // Limpiar y recargar
      setName('');
      setPrice('');
      setStock('');
      loadProducts();
      alert('¡Producto agregado!');
    } catch (error) {
      alert('Error al crear producto');
    }
  };

  // 3. Eliminar producto
  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Seguro que quieres eliminar este producto?')) return;
    try {
      await api.delete(`/products/${id}`);
      loadProducts();
    } catch (error) {
      alert('Error al eliminar');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="inventory-container">
      <div className="header-section">
        <h1>📦 Control de Bodega</h1>
        <button onClick={handleLogout} className="logout-btn">Cerrar Sesión</button>
      </div>

      {/* Formulario de Ingreso */}
      <form onSubmit={handleCreate} className="product-form">
        <div className="form-group">
          <label>Nombre del Producto</label>
          <input className="form-input" value={name} onChange={e => setName(e.target.value)} placeholder="Ej: Bebida Cola" required />
        </div>
        
        <div className="form-group">
          <label>Precio ($)</label>
          <input type="number" className="form-input" value={price} onChange={e => setPrice(e.target.value)} placeholder="Ej: 1500" required />
        </div>

        <div className="form-group">
          <label>Stock Inicial</label>
          <input type="number" className="form-input" value={stock} onChange={e => setStock(e.target.value)} placeholder="Ej: 50" required />
        </div>

        <div className="form-group">
          <label>Categoría</label>
          <select className="form-input" value={category} onChange={e => setCategory(e.target.value)}>
            <option value="Fondo">Plato de Fondo</option>
            <option value="Entrada">Entrada</option>
            <option value="Postre">Postre</option>
            <option value="Bebida">Bebida</option>
            <option value="Extra">Agregado</option>
          </select>
        </div>

        <button type="submit" className="add-btn">Agregar +</button>
      </form>

      {/* Tabla de Resultados */}
      <table className="inventory-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Categoría</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td>{p.name}</td>
              <td>{p.category}</td>
              <td>${p.price.toLocaleString()}</td>
              <td>
                <span className={`stock-badge ${p.stock < 10 ? 'low-stock' : ''}`}>
                  {p.stock} un.
                </span>
              </td>
              <td>
                <button onClick={() => handleDelete(p.id)} className="delete-btn">Eliminar</button>
              </td>
            </tr>
          ))}
          {products.length === 0 && <tr><td colSpan={5} style={{textAlign: 'center', padding: '20px'}}>La bodega está vacía. ¡Agrega productos!</td></tr>}
        </tbody>
      </table>
    </div>
  );
}