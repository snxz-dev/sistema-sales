import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, ShoppingCart, Package, Truck, Users, BarChart3, Hexagon } from 'lucide-react';
import clsx from 'clsx';
import styles from './Layout.module.css';

const Layout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/facturacion', label: 'Facturación', icon: ShoppingCart },
    { path: '/inventario', label: 'Inventario', icon: Package },
    { path: '/abastecimiento', label: 'Abastecimiento', icon: Truck },
    { path: '/entidades', label: 'Entidades', icon: Users },
    { path: '/reportes', label: 'Reportes', icon: BarChart3 },
  ];

  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <div className={styles.logoContainer}>
          <Hexagon className="text-primary" size={28} />
          <span className={styles.logoText}>SISTEMA SALES</span>
        </div>
        <nav className={styles.nav}>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => 
                clsx(styles.navLink, isActive && styles.navLinkActive)
              }
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className={styles.mainContent}>
        {children || <Outlet />}
      </main>
    </div>
  );
};

export default Layout;
