import React from 'react';
import { DollarSign, Package, ShoppingCart } from 'lucide-react';

const Dashboard: React.FC = () => {
  return (
    <div>
      <h1 className="text-2xl mb-6">Dashboard Resumen</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="card flex-col">
          <div className="flex items-center justify-between mb-2">
            <span className="text-muted">Ventas de Hoy</span>
            <DollarSign size={20} className="text-primary" />
          </div>
          <span className="text-2xl font-bold">$1,240.50</span>
        </div>
        
        <div className="card flex-col">
          <div className="flex items-center justify-between mb-2">
            <span className="text-muted">Stock Bajo</span>
            <Package size={20} style={{ color: 'var(--warning)' }} />
          </div>
          <span className="text-2xl font-bold">12 Productos</span>
        </div>

        <div className="card flex-col">
          <div className="flex items-center justify-between mb-2">
            <span className="text-muted">Órdenes Pendientes</span>
            <ShoppingCart size={20} style={{ color: 'var(--success)' }} />
          </div>
          <span className="text-2xl font-bold">4 Órdenes</span>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <h2 className="mb-4 text-muted">Accesos Rápidos</h2>
        <p>Bienvenido al prototipo de SISTEMA SALES S.A. Utilice el menú lateral para navegar por los módulos simulados de Facturación, Inventario, Abastecimiento, Entidades y Reportes.</p>
      </div>
    </div>
  );
};

export default Dashboard;
