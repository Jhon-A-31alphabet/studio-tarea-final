import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { CapacitorSQLite, SQLiteDBConnection } from '@capacitor-community/sqlite';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  private db?: SQLiteDBConnection;
  private webDB: any = null;
  private readonly databaseName = 'studio_app';

  private readonly tableStatements = `
    CREATE TABLE IF NOT EXISTS materias (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL UNIQUE,
      color TEXT,
      created_at TEXT DEFAULT (datetime('now','localtime'))
    );
    CREATE TABLE IF NOT EXISTS notas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      materia_id INTEGER NOT NULL,
      titulo TEXT NOT NULL,
      contenido TEXT,
      created_at TEXT DEFAULT (datetime('now','localtime')),
      FOREIGN KEY(materia_id) REFERENCES materias(id) ON DELETE CASCADE
    );
    CREATE TABLE IF NOT EXISTS tareas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      materia_id INTEGER,
      titulo TEXT NOT NULL,
      descripcion TEXT,
      fecha_hora TEXT,
      completado INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now','localtime')),
      FOREIGN KEY(materia_id) REFERENCES materias(id) ON DELETE SET NULL
    );
    CREATE TABLE IF NOT EXISTS recordatorios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tarea_id INTEGER NOT NULL,
      mensaje TEXT,
      recordatorio_hora TEXT,
      enviado INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now','localtime')),
      FOREIGN KEY(tarea_id) REFERENCES tareas(id) ON DELETE CASCADE
    );
  `;

  constructor() {}

  /**
   * Inicializa la base de datos SQLite y crea las tablas necesarias.
   */
  async initializeDatabase(): Promise<void> {
    if (this.db || this.webDB) {
      return;
    }
    await this.openConnection();
    await this.createTables();
  }

  /**
   * Abre una conexión SQLite nativa o WebSQL en el navegador.
   */
  private async openConnection(): Promise<void> {
    const platform = Capacitor.getPlatform();
    if (platform === 'web') {
      this.openWebDatabase();
      return;
    }

    this.db = await CapacitorSQLite.createConnection({
      database: this.databaseName,
      version: 1,
      encrypted: false,
      mode: 'no-encryption',
    });

    await this.db.open();
  }

  /**
   * Crea la base de datos usando WebSQL cuando se ejecuta en un navegador.
   */
  private openWebDatabase(): void {
    if (!this.webDB) {
      this.webDB = (window as any).openDatabase(
        this.databaseName,
        '1.0',
        'Base de datos de estudio',
        5 * 1024 * 1024,
      );
    }
  }

  /**
   * Crea todas las tablas necesarias para materias, notas, tareas y recordatorios.
   */
  private async createTables(): Promise<void> {
    const statements = this.tableStatements
      .split(';')
      .map((stmt) => stmt.trim())
      .filter((stmt) => stmt.length > 0);

    for (const statement of statements) {
      await this.execute(statement);
    }
  }

  /**
   * Ejecuta una sentencia SQL de escritura.
   */
  private async execute(statement: string, values: any[] = []): Promise<void> {
    if (this.webDB) {
      await new Promise<void>((resolve, reject) => {
        this.webDB!.transaction(
          (tx: any) => {
            tx.executeSql(
              statement,
              values,
              () => resolve(),
              (_tx: any, error: any) => {
                reject(error);
                return false;
              },
            );
          },
          reject,
        );
      });
      return;
    }

    if (!this.db) {
      throw new Error('La base de datos no está inicializada.');
    }

    await this.db.execute({ statements: statement });
  }

  /**
   * Ejecuta una consulta SQL de lectura y devuelve los resultados.
   */
  private async query(statement: string, values: any[] = []): Promise<any[]> {
    if (this.webDB) {
      return new Promise<any[]>((resolve, reject) => {
        this.webDB!.transaction(
          (tx: any) => {
            tx.executeSql(
              statement,
              values,
              (_tx: any, result: any) => {
                const rows: any[] = [];
                for (let i = 0; i < result.rows.length; i += 1) {
                  rows.push(result.rows.item(i));
                }
                resolve(rows);
              },
              (_tx: any, error: any) => {
                reject(error);
                return false;
              },
            );
          },
          reject,
        );
      });
    }

    if (!this.db) {
      throw new Error('La base de datos no está inicializada.');
    }

    const result = await this.db.query({ statement, values });
    return result.values || [];
  }

  /**
   * Inserta una nueva materia en la base de datos.
   */
  async addMateria(nombre: string, color: string = '#3880ff'): Promise<void> {
    await this.initializeDatabase();
    const statement = 'INSERT OR IGNORE INTO materias (nombre, color) VALUES (?, ?);';
    await this.execute(statement, [nombre, color]);
  }

  /**
   * Obtiene todas las materias almacenadas.
   */
  async getMaterias(): Promise<any[]> {
    await this.initializeDatabase();
    return this.query('SELECT * FROM materias ORDER BY created_at DESC;', []);
  }

  /**
   * Elimina una materia y todas sus notas y tareas relacionadas.
   */
  async deleteMateria(materiaId: number): Promise<void> {
    await this.initializeDatabase();
    await this.execute('DELETE FROM notas WHERE materia_id = ?;', [materiaId]);
    await this.execute('DELETE FROM tareas WHERE materia_id = ?;', [materiaId]);
    await this.execute('DELETE FROM materias WHERE id = ?;', [materiaId]);
  }

  /**
   * Inserta una nota asociada a una materia.
   */
  async addNota(materiaId: number, titulo: string, contenido: string): Promise<void> {
    await this.initializeDatabase();
    const statement = 'INSERT INTO notas (materia_id, titulo, contenido) VALUES (?, ?, ?);';
    await this.execute(statement, [materiaId, titulo, contenido]);
  }

  /**
   * Obtiene las notas de una materia específica.
   */
  async getNotasPorMateria(materiaId: number): Promise<any[]> {
    await this.initializeDatabase();
    return this.query('SELECT * FROM notas WHERE materia_id = ? ORDER BY created_at DESC;', [materiaId]);
  }

  /**
   * Inserta una tarea o recordatorio en la base de datos.
   */
  async addTarea(
    titulo: string,
    descripcion: string,
    fechaHora: string,
    materiaId?: number,
  ): Promise<void> {
    await this.initializeDatabase();
    const statement = 'INSERT INTO tareas (materia_id, titulo, descripcion, fecha_hora) VALUES (?, ?, ?, ?);';
    await this.execute(statement, [materiaId ?? null, titulo, descripcion, fechaHora]);
  }

  /**
   * Obtiene todas las tareas ordenadas por fecha y hora.
   */
  async getTareas(): Promise<any[]> {
    await this.initializeDatabase();
    return this.query('SELECT * FROM tareas ORDER BY fecha_hora ASC, created_at DESC;', []);
  }

  /**
   * Cambia el estado de una tarea entre completada y pendiente.
   */
  async setTareaCompletada(tareaId: number, completado: boolean): Promise<void> {
    await this.initializeDatabase();
    const statement = 'UPDATE tareas SET completado = ? WHERE id = ?;';
    await this.execute(statement, [completado ? 1 : 0, tareaId]);
  }

  /**
   * Elimina una tarea de la base de datos.
   */
  async deleteTarea(tareaId: number): Promise<void> {
    await this.initializeDatabase();
    await this.execute('DELETE FROM recordatorios WHERE tarea_id = ?;', [tareaId]);
    await this.execute('DELETE FROM tareas WHERE id = ?;', [tareaId]);
  }
}
