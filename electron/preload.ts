import { contextBridge, ipcRenderer } from 'electron';

export interface API {
  getProductos: () => Promise<any[]>;
  registrarFactura: (factura: any) => Promise<{ success: boolean }>;
  anularFactura: (numero: string) => Promise<{ success: boolean }>;
  crearOrden: (orden: any) => Promise<{ success: boolean }>;
  recibirOrden: (numero: string, precios: any) => Promise<{ success: boolean }>;
  getEntidades: (tipo: string) => Promise<any[]>;
}

const api: API = {
  getProductos: () => ipcRenderer.invoke('get-productos'),
  registrarFactura: (factura) => ipcRenderer.invoke('registrar-factura', factura),
  anularFactura: (numero) => ipcRenderer.invoke('anular-factura', numero),
  crearOrden: (orden) => ipcRenderer.invoke('crear-orden', orden),
  recibirOrden: (numero, precios) => ipcRenderer.invoke('recibir-orden', numero, precios),
  getEntidades: (tipo) => ipcRenderer.invoke('get-entidades', tipo),
};

contextBridge.exposeInMainWorld('api', api);

export type WindowApi = typeof api;
