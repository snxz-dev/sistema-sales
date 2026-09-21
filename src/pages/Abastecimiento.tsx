import React from 'react';
import { Plus, Search, Truck } from 'lucide-react';

const Abastecimiento: React.FC = () => {
  return (
    <div>
      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl">Órdenes de Compra (Abastecimiento)</h1>
        <button className="btn-primary flex items-center gap-2">
          <Plus size={18} /> Nueva Orden
        </button>
      </div>

      <div className="card mb-6">
        <h2 className="text-muted mb-4">Registro de Abastecimiento</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div className="flex-col gap-2">
            <label>Proveedor</label>
            <select>
              <option>TechCorp Solutions</option>
              <option>Global Imports S.A.</option>
            </select>
          </div>
          <div className="flex-col gap-2">
            <label>Producto a Reabastecer</label>
            <div className="flex gap-2">
              <input type="text" placeholder="Buscar producto..." />
              <button className="btn-primary" style={{ padding: '0.5rem' }}><Search size={18} /></button>
            </div>
          </div>
          <div className="flex-col gap-2">
            <label>Precio Compra</label>
            <input type="number" placeholder="0.00" />
          </div>
          <div className="flex-col gap-2">
            <label>Cantidad</label>
            <input type="number" defaultValue="10" />
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <button className="btn-primary flex items-center gap-2" style={{ background: 'var(--success)' }}>
            <Truck size={18} /> Registrar Recepción (Actualizar Stock)
          </button>
        </div>
      </div>
    </div>
  );
};

export default Abastecimiento;
