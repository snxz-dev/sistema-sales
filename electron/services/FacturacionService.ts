import { getDb } from '../database/db';

export interface FacturaDetalleDTO {
  codigo_producto: string;
  cantidad: number;
}

export interface FacturaDTO {
  numero_factura: string;
  ruc_cliente: string;
  id_vendedor: string;
  iva: number;
  detalles: FacturaDetalleDTO[];
}

export class FacturacionService {
  static registrarFactura(factura: FacturaDTO) {
    const db = getDb();
    
    const transaction = db.transaction((fact: FacturaDTO) => {
      // 1. Obtener los precios directamente desde la BD para validar y calcular
      const stmtGetProduct = db.prepare('SELECT stock_actual, descripcion, precio FROM PRODUCTO WHERE codigo_producto = ?');
      
      const detallesValidados = [];

      for (const det of fact.detalles) {
        const row = stmtGetProduct.get(det.codigo_producto) as { stock_actual: number, descripcion: string, precio: number } | undefined;
        if (!row) {
          throw new Error(`Producto no encontrado: ${det.codigo_producto}`);
        }
        if (row.stock_actual < det.cantidad) {
          throw new Error(`Stock insuficiente para el producto ${row.descripcion}. Disponible: ${row.stock_actual}, Solicitado: ${det.cantidad}`);
        }
        detallesValidados.push({
          codigo_producto: det.codigo_producto,
          cantidad: det.cantidad,
          precio_venta: row.precio // El precio se impone desde el backend
        });
      }

      // 2. Insertar cabecera de FACTURA
      const stmtFactura = db.prepare(`
        INSERT INTO FACTURA (numero_factura, fecha_registro, estado, iva, ruc_cliente, id_vendedor)
        VALUES (?, datetime('now', 'localtime'), 'Emitida', ?, ?, ?)
      `);
      stmtFactura.run(fact.numero_factura, fact.iva, fact.ruc_cliente, fact.id_vendedor);

      // 3. Insertar detalles y actualizar stock
      const stmtDetalle = db.prepare(`
        INSERT INTO DETALLE_FACTURA (numero_factura, codigo_producto, cantidad, precio_venta)
        VALUES (?, ?, ?, ?)
      `);
      
      const stmtUpdateStock = db.prepare(`
        UPDATE PRODUCTO 
        SET stock_actual = stock_actual - ? 
        WHERE codigo_producto = ?
      `);

      for (const det of detallesValidados) {
        stmtDetalle.run(fact.numero_factura, det.codigo_producto, det.cantidad, det.precio_venta);
        stmtUpdateStock.run(det.cantidad, det.codigo_producto);
      }
    });

    transaction(factura);
  }

  static anularFactura(numero_factura: string) {
    const db = getDb();

    const transaction = db.transaction((id: string) => {
      // 1. Verificar estado actual
      const stmtCheck = db.prepare('SELECT estado FROM FACTURA WHERE numero_factura = ?');
      const row = stmtCheck.get(id) as { estado: string } | undefined;
      
      if (!row) throw new Error(`Factura ${id} no encontrada`);
      if (row.estado === 'Anulada') throw new Error(`La factura ${id} ya se encuentra anulada`);

      // 2. Obtener detalles para restaurar stock
      const stmtDetalles = db.prepare('SELECT codigo_producto, cantidad FROM DETALLE_FACTURA WHERE numero_factura = ?');
      const detalles = stmtDetalles.all(id) as { codigo_producto: string, cantidad: number }[];

      // 3. Restaurar stock
      const stmtRestoreStock = db.prepare(`
        UPDATE PRODUCTO 
        SET stock_actual = stock_actual + ? 
        WHERE codigo_producto = ?
      `);
      for (const det of detalles) {
        stmtRestoreStock.run(det.cantidad, det.codigo_producto);
      }

      // 4. Marcar como anulada
      const stmtAnular = db.prepare(`UPDATE FACTURA SET estado = 'Anulada', fecha_cancelacion = datetime('now', 'localtime') WHERE numero_factura = ?`);
      stmtAnular.run(id);
    });

    transaction(numero_factura);
  }
}
