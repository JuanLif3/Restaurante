// apps/frontend/src/app/pages/Finances.tsx
import { useEffect, useState } from 'react';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';
import './css/Finances.css';

export default function Finances() {
  const [summary, setSummary] = useState({
    totalSales: 0,
    totalExpenses: 0,
    balance: 0
  });
  
  // Estados para registrar gasto
  const [desc, setDesc] = useState('');
  const [amount, setAmount] = useState('');
  
  const navigate = useNavigate();

  const loadData = async () => {
    try {
      const { data } = await api.get('/finances/summary');
      setSummary(data);
    } catch (error) {
      alert('Error cargando finanzas. ¿Tienes permisos?');
      navigate('/login'); // Si no es admin/finanzas, lo saca
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!desc || !amount) return;

    try {
      await api.post('/finances', {
        type: 'egreso',
        description: desc,
        amount: parseInt(amount)
      });
      
      alert('Gasto registrado correctamente');
      setDesc('');
      setAmount('');
      loadData(); // Recargar los números
    } catch (error) {
      alert('Error al registrar gasto');
    }
  };

  // Formatear dinero (CLP)
  const fmt = (num: number) => `$ ${num.toLocaleString()}`;

  return (
    <div className="finances-container">
      <div className="finances-header">
        <h1>💰 Balance Financiero</h1>
        <p>Estado actual de la caja del restaurante</p>
      </div>

      {/* TARJETAS DE RESUMEN */}
      <div className="summary-cards">
        <div className="card income">
          <h3>Ventas Totales</h3>
          <div className="amount">{fmt(summary.totalSales)}</div>
          <small>Ingresos por Pedidos</small>
        </div>

        <div className="card expense">
          <h3>Gastos Registrados</h3>
          <div className="amount">- {fmt(summary.totalExpenses)}</div>
          <small>Compras y Egresos</small>
        </div>

        <div className="card balance">
          <h3>Ganancia Neta</h3>
          <div className="amount">{fmt(summary.balance)}</div>
          <small>En Caja</small>
        </div>
      </div>

      {/* REGISTRO DE GASTOS */}
      <div className="expense-form">
        <h2>📉 Registrar Gasto (Salida de Caja)</h2>
        <form onSubmit={handleAddExpense}>
          <div className="form-row">
            <div className="form-group">
              <label>Descripción</label>
              <input 
                className="form-control" 
                placeholder="Ej: Compra de limones, Pago proveedor..." 
                value={desc}
                onChange={e => setDesc(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Monto ($)</label>
              <input 
                type="number" 
                className="form-control" 
                placeholder="0" 
                value={amount}
                onChange={e => setAmount(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="save-btn">Registrar</button>
          </div>
        </form>
      </div>

      <div style={{textAlign: 'center'}}>
        <button onClick={() => { localStorage.clear(); navigate('/login'); }} className="logout-btn-fin">
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
}