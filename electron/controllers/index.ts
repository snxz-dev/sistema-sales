import { ipcMain } from 'electron';
import { FacturacionService } from '../services/FacturacionService';
import { AbastecimientoService } from '../services/AbastecimientoService';
import { getDb } from '../database/db';

export function registerControllers() {
  ipcMain.handle('get-productos', () => {
    return getDb().prepare('SELECT * FROM PRODUCTO').all();
  });
  
  ipcMain.handle('registrar-factura', (_, factura) => {
    FacturacionService.registrarFactura(factura);
    return { success: true };
  });

  ipcMain.handle('anular-factura', (_, numero_factura) => {
    FacturacionService.anularFactura(numero_factura);
    return { success: true };
  });

  ipcMain.handle('crear-orden', (_, orden) => {
    AbastecimientoService.crearOrden(orden);
    return { success: true };
  });

  ipcMain.handle('recibir-orden', (_, numero_orden, precios) => {
    AbastecimientoService.recibirOrden(numero_orden, precios);
    return { success: true };
  });

  ipcMain.handle('get-entidades', (_, tipo: string) => {
    // Validación estricta contra inyección
    const permitidos = ['CLIENTE', 'PROVEEDOR', 'VENDEDOR', 'DISTRITO'];
    const tabla = tipo.toUpperCase();
    if (!permitidos.includes(tabla)) throw new Error('Entidad no válida');
    
    return getDb().prepare(`SELECT * FROM ${tabla}`).all();
  });
}
