import React, { useState } from 'react';
import { Users, Briefcase, MapPin } from 'lucide-react';

const Entidades: React.FC = () => {
  const [tab, setTab] = useState('clientes');

  return (
    <div>
      <h1 className="text-2xl mb-6">Gestión de Entidades</h1>

      <div className="flex flex-wrap gap-4 mb-6" style={{ borderBottom: '1px solid var(--border)' }}>
        <button 
          onClick={() => setTab('clientes')}
          style={{ 
            padding: '1rem', 
            background: 'transparent', 
            color: tab === 'clientes' ? 'var(--primary)' : 'var(--text-muted)',
            borderBottom: tab === 'clientes' ? '2px solid var(--primary)' : 'none'
          }}
          className="flex items-center gap-2"
        >
          <Users size={18} /> Clientes
        </button>
        <button 
          onClick={() => setTab('proveedores')}
          style={{ 
            padding: '1rem', 
            background: 'transparent', 
            color: tab === 'proveedores' ? 'var(--primary)' : 'var(--text-muted)',
            borderBottom: tab === 'proveedores' ? '2px solid var(--primary)' : 'none'
          }}
          className="flex items-center gap-2"
        >
          <Briefcase size={18} /> Proveedores
        </button>
        <button 
          onClick={() => setTab('distritos')}
          style={{ 
            padding: '1rem', 
            background: 'transparent', 
            color: tab === 'distritos' ? 'var(--primary)' : 'var(--text-muted)',
            borderBottom: tab === 'distritos' ? '2px solid var(--primary)' : 'none'
          }}
          className="flex items-center gap-2"
        >
          <MapPin size={18} /> Distritos
        </button>
      </div>

      <div className="card">
        <h2 className="text-muted mb-4">Formulario de Registro: {tab.toUpperCase()}</h2>
        {tab === 'clientes' && (
          <div className="flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input type="text" placeholder="RUC / Cédula" />
              <input type="text" placeholder="Razón Social / Nombre" style={{ gridColumn: 'span 2' }} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <input type="text" placeholder="Teléfono" />
              <select>
                <option>Distrito Norte</option>
                <option>Distrito Sur</option>
              </select>
            </div>
          </div>
        )}
        <div className="flex justify-end mt-6">
          <button className="btn-primary">Guardar Entidad</button>
        </div>
      </div>
    </div>
  );
};

export default Entidades;
