import { getDb } from '../database/db';

export interface OrdenCompraDTO {
  numero_orden: string;
  id_proveedor: string;
  detalles: { codigo_producto: string, cantidad: number }[];
}

export class AbastecimientoService {
  
  static crearOrden(orden: OrdenCompraDTO) {
    const db = getDb();

    const transaction = db.transaction((ord: OrdenCompraDTO) => {
      // 1. Crear Orden en estado PENDIENTE (No afecta stock)
      const stmtOrden = db.prepare(`
        INSERT INTO ORDEN_COMPRA (numero_orden, fecha_registro, estado, id_proveedor)
        VALUES (?, datetime('now', 'localtime'), 'Pendiente', ?)
      `);
      stmtOrden.run(ord.numero_orden, ord.id_proveedor);

      // 2. Crear Detalle
      const stmtDetalle = db.prepare(`
        INSERT INTO DETALLE_ORDEN (numero_orden, codigo_producto, cantidad_solicitada)
        VALUES (?, ?, ?)
      `);
      for (const det of ord.detalles) {
        stmtDetalle.run(ord.numero_orden, det.codigo_producto, det.cantidad);
      }
    });

    transaction(orden);
  }

  static recibirOrden(numero_orden: string, preciosAcordados: { codigo_producto: string, precio_compra: number }[]) {
    const db = getDb();

    const transaction = db.transaction((id: string) => {
      // 1. Verificar que la orden exista y esté PENDIENTE
      const stmtCheck = db.prepare('SELECT estado, id_proveedor FROM ORDEN_COMPRA WHERE numero_orden = ?');
      const ordenRow = stmtCheck.get(id) as { estado: string, id_proveedor: string } | undefined;
      
      if (!ordenRow) throw new Error(`Orden ${id} no encontrada`);
      if (ordenRow.estado === 'Recibida') throw new Error(`La orden ${id} ya fue recibida. No se puede duplicar el stock.`);
      if (ordenRow.estado === 'Cancelada') throw new Error(`La orden ${id} está cancelada.`);

      // 2. Obtener los detalles
      const stmtDetalles = db.prepare('SELECT codigo_producto, cantidad_solicitada FROM DETALLE_ORDEN WHERE numero_orden = ?');
      const detalles = stmtDetalles.all(id) as { codigo_producto: string, cantidad_solicitada: number }[];

      // 3. Procesar stock y precios
      const stmtAsoc = db.prepare(`
        INSERT INTO ABASTECIMIENTO (id_proveedor, codigo_producto, precio)
        VALUES (?, ?, ?)
        ON CONFLICT(id_proveedor, codigo_producto) DO UPDATE SET precio=excluded.precio
      `);
      
      const stmtUpdateStock = db.prepare(`
        UPDATE PRODUCTO 
        SET stock_actual = stock_actual + ? 
        WHERE codigo_producto = ?
      `);

      for (const det of detalles) {
        // Aumentar stock
        stmtUpdateStock.run(det.cantidad_solicitada, det.codigo_producto);
        
        // Guardar nuevo precio pactado
        const precioAsignado = preciosAcordados.find(p => p.codigo_producto === det.codigo_producto)?.precio_compra || 0;
        stmtAsoc.run(ordenRow.id_proveedor, det.codigo_producto, precioAsignado);
      }

      // 4. Cambiar estado a RECIBIDA
      const stmtUpdateEstado = db.prepare(`UPDATE ORDEN_COMPRA SET estado = 'Recibida', fecha_atencion = datetime('now', 'localtime') WHERE numero_orden = ?`);
      stmtUpdateEstado.run(id);
    });

    transaction(numero_orden);
  }
}
