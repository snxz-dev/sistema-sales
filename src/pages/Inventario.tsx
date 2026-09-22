import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, Search } from 'lucide-react';

const Inventario: React.FC = () => {
  const [productos, setProductos] = useState<any[]>([]);

  React.useEffect(() => {
    // @ts-ignore
    if (window.api) {
      // @ts-ignore
      window.api.getProductos().then(setProductos).catch(console.error);
    }
  }, []);

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
                <tr key={p.codigo_producto}>
                  <td>{p.codigo_producto}</td>
                  <td>{p.descripcion}</td>
                  <td>{p.marca}</td>
                  <td>${p.precio.toFixed(2)}</td>
                  <td>{p.stock_actual}</td>
                  <td>
                    {p.stock_actual < p.stock_minimo ? (
                      <div className="flex items-center gap-2" style={{ color: 'var(--warning)' }}>
                        <AlertTriangle size={18} />
                        <span>Stock Bajo (Mín: {p.stock_minimo})</span>
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
