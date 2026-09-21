import React from 'react';
import { AlertTriangle, CheckCircle, Search } from 'lucide-react';

const Inventario: React.FC = () => {
  const productos = [
    { codigo: 'PRD-001', desc: 'Laptop X100', marca: 'TechCorp', stock: 45, min: 10, precio: 850.00 },
    { codigo: 'PRD-002', desc: 'Mouse Inalámbrico', marca: 'Clicker', stock: 5, min: 20, precio: 15.50 },
    { codigo: 'PRD-003', desc: 'Monitor 24"', marca: 'ViewScreen', stock: 12, min: 15, precio: 150.00 },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl">Inventario de Productos</h1>
        <div className="flex gap-2">
          <input type="text" placeholder="Buscar por código o descripción..." style={{ width: '300px' }} />
          <button className="btn-primary"><Search size={18} /></button>
        </div>
      </div>

      <div className="card">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Código</th>
                <th>Descripción</th>
                <th>Marca</th>
                <th>Precio</th>
                <th>Stock Actual</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {productos.map(p => (
                <tr key={p.codigo}>
                  <td>{p.codigo}</td>
                  <td>{p.desc}</td>
                  <td>{p.marca}</td>
                  <td>${p.precio.toFixed(2)}</td>
                  <td>{p.stock}</td>
                  <td>
                    {p.stock < p.min ? (
                      <div className="flex items-center gap-2" style={{ color: 'var(--warning)' }}>
                        <AlertTriangle size={18} />
                        <span>Stock Bajo (Mín: {p.min})</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2" style={{ color: 'var(--success)' }}>
                        <CheckCircle size={18} />
                        <span>Adecuado</span>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Inventario;
