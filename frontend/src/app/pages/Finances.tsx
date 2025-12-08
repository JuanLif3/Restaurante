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
  
  const [desc, setDesc] = useState('');
  const [amount, setAmount] = useState('');
  const navigate = useNavigate();

  const loadData = async () => {
    try {
      const { data } = await api.get('/finances/summary');
      setSummary(data);
    } catch (error) {
      alert('Acceso denegado o sesión expirada.');
      navigate('/login');
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
      
      setDesc('');
      setAmount('');
      loadData();
    } catch (error) {
      alert('Error al registrar la transacción.');
    }
  };

  const fmt = (num: number) => `$ ${num.toLocaleString()}`;

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="finances-container">
      <div className="finances-header">
        <h1>Estado Financiero</h1>
        <p>Reporte de Flujo de Caja & Balance General</p>
      </div>

      {/* TARJETAS DE RESUMEN */}
      <div className="summary-cards">
        <div className="card income">
          <h3>Ingresos por Ventas</h3>
          <div className="amount">{fmt(summary.totalSales)}</div>
        </div>

        <div className="card expense">
          <h3>Gastos Operativos</h3>
          <div className="amount">- {fmt(summary.totalExpenses)}</div>
        </div>

        <div className="card balance">
          <h3>Balance Neto</h3>
          <div className="amount">{fmt(summary.balance)}</div>
        </div>
      </div>

      {/* REGISTRO DE GASTOS */}
      <div className="expense-form">
        <h2>Registrar Egreso de Caja</h2>
        <form onSubmit={handleAddExpense}>
          <div className="form-row">
            <div className="form-group">
              <label>Concepto / Detalle</label>
              <input 
                className="form-control" 
                placeholder="Ej: Pago a proveedores..." 
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

            <button type="submit" className="save-btn">Procesar</button>
          </div>
        </form>
      </div>

      <div style={{textAlign: 'center'}}>
        <button onClick={handleLogout} className="logout-btn-fin">
          Cerrar Sesión Segura
        </button>
      </div>
    </div>
  );
}