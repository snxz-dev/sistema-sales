import React, { useState } from 'react';
import { Plus, Search, Trash2 } from 'lucide-react';

const Facturacion: React.FC = () => {
  const [items] = useState([
    { id: 1, desc: 'Producto de prueba A', cant: 2, precio: 15.00 }
  ]);

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl">Nueva Factura de Venta</h1>
        <button className="btn-primary flex items-center gap-2">
          <Plus size={18} /> Procesar Factura
        </button>
      </div>

      <div className="card mb-6">
        <h2 className="text-muted mb-4">Datos Generales</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex-col gap-2">
            <label>Cliente (RUC/Nombre)</label>
            <input type="text" placeholder="Buscar cliente..." />
          </div>
          <div className="flex-col gap-2">
            <label>Vendedor</label>
            <select>
              <option>Juan Pérez</option>
              <option>María López</option>
            </select>
          </div>
        </div>
      </div>

      <div className="card mb-6">
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <h2 className="text-muted" style={{ margin: 0 }}>Detalle de Productos</h2>
          <div className="flex gap-2" style={{ flexGrow: 1, maxWidth: '400px' }}>
            <input type="text" placeholder="Código o descripción..." />
            <button className="btn-primary" style={{ padding: '0.5rem' }}><Search size={18} /></button>
          </div>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Descripción</th>
                <th>Cantidad</th>
                <th>Precio Unit.</th>
                <th>Subtotal</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id}>
                  <td>{item.desc}</td>
                  <td>
                    <input type="number" defaultValue={item.cant} style={{ width: '100px' }} />
                  </td>
                  <td>${item.precio.toFixed(2)}</td>
                  <td>${(item.cant * item.precio).toFixed(2)}</td>
                  <td>
                    <button className="text-muted" style={{ background: 'transparent', padding: '0.5rem' }}>
                      <Trash2 size={18} style={{ color: 'var(--danger)' }} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex flex-col items-end gap-2 text-2xl font-bold">
        <span>Subtotal: $30.00</span>
        <span className="text-muted" style={{ fontSize: '1rem' }}>IVA (15%): $4.50</span>
        <span style={{ color: 'var(--success)' }}>Total: $34.50</span>
      </div>
    </div>
  );
};

export default Facturacion;
