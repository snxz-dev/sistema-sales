import Database from 'better-sqlite3';
import { app } from 'electron';
import path from 'node:path';
import { initSchema } from './schema';

let db: Database.Database | null = null;

export function setupDatabase() {
  // Guardamos la base de datos en userData para asegurar permisos de escritura
  const userDataPath = app.getPath('userData');
  const dbPath = path.join(userDataPath, 'database.sqlite');
  
  db = new Database(dbPath, { verbose: console.log });
  
  // Activar Foreign Keys rigurosamente
  db.pragma('foreign_keys = ON');

  // Inicializar de forma idempotente
  initSchema(db);
}

export function getDb(): Database.Database {
  if (!db) {
    throw new Error("Base de datos no inicializada. Llama a setupDatabase primero.");
  }
  return db;
}
