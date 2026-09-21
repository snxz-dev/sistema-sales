import React from 'react';
import { BarChart3, TrendingUp, PackageSearch } from 'lucide-react';

const Reportes: React.FC = () => {
  return (
    <div>
      <h1 className="text-2xl mb-6">Reportes Gerenciales</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="card flex-col gap-2" style={{ borderTop: '3px solid var(--primary)' }}>
          <div className="flex items-center gap-2">
            <TrendingUp className="text-primary" size={24} />
            <h2 className="font-bold">Reporte de Ventas</h2>
          </div>
          <p className="text-muted text-sm">Análisis de facturación mensual, vendedores top y tendencias.</p>
          <button className="btn-primary mt-4" style={{ alignSelf: 'flex-start' }}>Generar PDF</button>
        </div>

        <div className="card flex-col gap-2" style={{ borderTop: '3px solid var(--warning)' }}>
          <div className="flex items-center gap-2">
            <PackageSearch style={{ color: 'var(--warning)' }} size={24} />
            <h2 className="font-bold">Reporte de Inventario</h2>
          </div>
          <p className="text-muted text-sm">Listado de productos con stock crítico, valoración de inventario actual.</p>
          <button className="btn-primary mt-4" style={{ alignSelf: 'flex-start' }}>Generar PDF</button>
        </div>

        <div className="card flex-col gap-2" style={{ borderTop: '3px solid var(--success)' }}>
          <div className="flex items-center gap-2">
            <BarChart3 style={{ color: 'var(--success)' }} size={24} />
            <h2 className="font-bold">Análisis de Abastecimiento</h2>
          </div>
          <p className="text-muted text-sm">Historial de órdenes de compra, eficiencia de proveedores.</p>
          <button className="btn-primary mt-4" style={{ alignSelf: 'flex-start' }}>Generar PDF</button>
        </div>
      </div>
      
      <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
        <p className="text-muted">Área reservada para gráficos interactivos (ej. Chart.js o Recharts) en Fase 5.</p>
      </div>
    </div>
  );
};

export default Reportes;
