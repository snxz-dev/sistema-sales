import type { Database } from 'better-sqlite3';

export function initSchema(db: Database) {
  // Transacción para asegurar la creación idempotente del esquema
  const init = db.transaction(() => {
    db.exec(`
      CREATE TABLE IF NOT EXISTS DISTRITO (
        id_distrito TEXT PRIMARY KEY,
        descripcion TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS CLIENTE (
        ruc TEXT PRIMARY KEY,
        razon_social TEXT NOT NULL,
        direccion TEXT,
        telefono TEXT,
        fecha_registro TEXT,
        tipo TEXT,
        condicion TEXT,
        id_distrito TEXT,
        FOREIGN KEY (id_distrito) REFERENCES DISTRITO(id_distrito)
      );

      CREATE TABLE IF NOT EXISTS PROVEEDOR (
        id_proveedor TEXT PRIMARY KEY,
        razon_social TEXT NOT NULL,
        direccion TEXT,
        telefono TEXT,
        representante_legal TEXT,
        id_distrito TEXT,
        FOREIGN KEY (id_distrito) REFERENCES DISTRITO(id_distrito)
      );

      CREATE TABLE IF NOT EXISTS VENDEDOR (
        id_vendedor TEXT PRIMARY KEY,
        nombres TEXT NOT NULL,
        apellidos TEXT NOT NULL,
        sueldo REAL,
        fecha_inicio TEXT,
        tipo TEXT,
        id_distrito TEXT,
        FOREIGN KEY (id_distrito) REFERENCES DISTRITO(id_distrito)
      );

      CREATE TABLE IF NOT EXISTS PRODUCTO (
        codigo_producto TEXT PRIMARY KEY,
        descripcion TEXT NOT NULL,
        precio REAL NOT NULL,
        stock_actual INTEGER DEFAULT 0,
        stock_minimo INTEGER DEFAULT 0,
        marca TEXT,
        linea_producto TEXT,
        importado INTEGER DEFAULT 0
      );

      CREATE TABLE IF NOT EXISTS ABASTECIMIENTO (
        id_proveedor TEXT,
        codigo_producto TEXT,
        precio REAL NOT NULL,
        PRIMARY KEY (id_proveedor, codigo_producto),
        FOREIGN KEY (id_proveedor) REFERENCES PROVEEDOR(id_proveedor),
        FOREIGN KEY (codigo_producto) REFERENCES PRODUCTO(codigo_producto)
      );

      CREATE TABLE IF NOT EXISTS FACTURA (
        numero_factura TEXT PRIMARY KEY,
        fecha_registro TEXT NOT NULL,
        fecha_cancelacion TEXT,
        estado TEXT NOT NULL,
        iva REAL DEFAULT 15.0,
        ruc_cliente TEXT NOT NULL,
        id_vendedor TEXT NOT NULL,
        FOREIGN KEY (ruc_cliente) REFERENCES CLIENTE(ruc),
        FOREIGN KEY (id_vendedor) REFERENCES VENDEDOR(id_vendedor)
      );

      CREATE TABLE IF NOT EXISTS DETALLE_FACTURA (
        id_detalle INTEGER PRIMARY KEY AUTOINCREMENT,
        numero_factura TEXT NOT NULL,
        codigo_producto TEXT NOT NULL,
        cantidad INTEGER NOT NULL,
        precio_venta REAL NOT NULL,
        FOREIGN KEY (numero_factura) REFERENCES FACTURA(numero_factura),
        FOREIGN KEY (codigo_producto) REFERENCES PRODUCTO(codigo_producto)
      );

      CREATE TABLE IF NOT EXISTS ORDEN_COMPRA (
        numero_orden TEXT PRIMARY KEY,
        fecha_registro TEXT NOT NULL,
        fecha_atencion TEXT,
        estado TEXT NOT NULL,
        id_proveedor TEXT NOT NULL,
        FOREIGN KEY (id_proveedor) REFERENCES PROVEEDOR(id_proveedor)
      );

      CREATE TABLE IF NOT EXISTS DETALLE_ORDEN (
        id_detalle_orden INTEGER PRIMARY KEY AUTOINCREMENT,
        numero_orden TEXT NOT NULL,
        codigo_producto TEXT NOT NULL,
        cantidad_solicitada INTEGER NOT NULL,
        FOREIGN KEY (numero_orden) REFERENCES ORDEN_COMPRA(numero_orden),
        FOREIGN KEY (codigo_producto) REFERENCES PRODUCTO(codigo_producto)
      );
      
      -- Tabla simple para controlar migraciones futuras
      CREATE TABLE IF NOT EXISTS MIGRATIONS (
        version INTEGER PRIMARY KEY,
        applied_at TEXT DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    // Configuración básica de versión (Ejemplo)
    const versionRow = db.prepare('SELECT version FROM MIGRATIONS ORDER BY version DESC LIMIT 1').get() as { version: number } | undefined;
    if (!versionRow) {
      db.prepare('INSERT INTO MIGRATIONS (version) VALUES (1)').run();
    }
  });

  init();
}
