import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Facturacion from './pages/Facturacion';
import Inventario from './pages/Inventario';
import Abastecimiento from './pages/Abastecimiento';
import Entidades from './pages/Entidades';
import Reportes from './pages/Reportes';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/facturacion" element={<Facturacion />} />
          <Route path="/inventario" element={<Inventario />} />
          <Route path="/abastecimiento" element={<Abastecimiento />} />
          <Route path="/entidades" element={<Entidades />} />
          <Route path="/reportes" element={<Reportes />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
