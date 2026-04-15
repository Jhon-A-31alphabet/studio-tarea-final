import { Injectable } from '@angular/core';
import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';
import { Capacitor } from '@capacitor/core';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private sqlite: SQLiteConnection;
  private db: SQLiteDBConnection | null = null;
  private isInit = false;

  constructor() {
    this.sqlite = new SQLiteConnection(CapacitorSQLite);
  }

  async initializeDatabase() {
    // Solo inicializar si estamos en Android/iOS
    if (Capacitor.getPlatform() === 'web') {
      console.log('En web, no se inicializa SQLite');
      return;
    }

    if (this.isInit && this.db) {
      console.log('Base de datos ya inicializada');
      return;
    }
    
    try {
      console.log('Inicializando base de datos en Android...');
      
      // Para Android, usar la configuración específica
      this.db = await this.sqlite.createConnection(
        'tareas_db',
        false,
        'no-encryption',
        1,
        false
      );
      
      await this.db.open();
      console.log('Conexión a BD abierta');
      
      // Crear la tabla de tareas
      const query = `
        CREATE TABLE IF NOT EXISTS tareas (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          descripcion TEXT NOT NULL,
          fecha TEXT NOT NULL,
          hora TEXT NOT NULL,
          completada INTEGER DEFAULT 0,
          notificacion_id INTEGER
        );
      `;
      
      await this.db.execute(query);
      console.log('Tabla creada/verificada');
      
      this.isInit = true;
      console.log('Base de datos inicializada correctamente en Android');
    } catch (error) {
      console.error('Error al inicializar DB en Android:', error);
      throw error;
    }
  }

  async agregarTarea(descripcion: string, fecha: string, hora: string, notificacionId: number) {
    if (Capacitor.getPlatform() === 'web') {
      console.log('En web, no se guarda');
      return;
    }
    
    if (!this.db) {
      await this.initializeDatabase();
    }
    
    if (!this.db) {
      throw new Error('No se pudo inicializar la base de datos');
    }
    
    try {
      const query = `
        INSERT INTO tareas (descripcion, fecha, hora, notificacion_id)
        VALUES (?, ?, ?, ?)
      `;
      const values = [descripcion, fecha, hora, notificacionId];
      const result = await this.db.run(query, values);
      console.log('Tarea insertada en Android:', result);
      return result;
    } catch (error) {
      console.error('Error al insertar tarea:', error);
      throw error;
    }
  }

  async obtenerTareas() {
    if (Capacitor.getPlatform() === 'web') {
      return [];
    }
    
    if (!this.db) {
      await this.initializeDatabase();
    }
    
    if (!this.db) {
      return [];
    }
    
    try {
      const query = 'SELECT * FROM tareas ORDER BY fecha, hora';
      const result = await this.db.query(query);
      console.log('Tareas obtenidas de Android:', result.values);
      return result.values || [];
    } catch (error) {
      console.error('Error al obtener tareas:', error);
      return [];
    }
  }

  async eliminarTarea(id: number) {
    if (Capacitor.getPlatform() === 'web') return;
    
    if (!this.db) {
      await this.initializeDatabase();
    }
    
    try {
      const query = 'DELETE FROM tareas WHERE id = ?';
      await this.db!.run(query, [id]);
      console.log('Tarea eliminada de Android:', id);
    } catch (error) {
      console.error('Error al eliminar tarea:', error);
      throw error;
    }
  }

  async actualizarTareaCompletada(id: number, completada: number) {
    if (Capacitor.getPlatform() === 'web') return;
    
    if (!this.db) {
      await this.initializeDatabase();
    }
    
    try {
      const query = 'UPDATE tareas SET completada = ? WHERE id = ?';
      await this.db!.run(query, [completada, id]);
      console.log('Tarea actualizada en Android:', id);
    } catch (error) {
      console.error('Error al actualizar tarea:', error);
      throw error;
    }
  }
}