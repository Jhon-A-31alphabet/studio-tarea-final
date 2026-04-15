import { Injectable } from '@angular/core';
import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';
import { LocalNotifications } from '@capacitor/local-notifications';

export interface Subject {
  id: number;
  name: string;
  color: string;
}

export interface Note {
  id: number;
  subject_id: number;
  title: string;
  content: string;
}

export interface Task {
  id: number;
  description: string;
  date: string;
  time: string;
  completed: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private sqlite: SQLiteConnection = new SQLiteConnection(CapacitorSQLite);
  private db!: SQLiteDBConnection;
  private dbName = 'notepad.db';

  constructor() {}

  async initializeDatabase(): Promise<void> {
    try {
      this.db = await this.sqlite.createConnection(this.dbName, false, 'no-encryption', 1, false);
      await this.db.open();

      // Create tables
      await this.createTables();
    } catch (error) {
      console.error('Error initializing database:', error);
    }
  }

  private async createTables(): Promise<void> {
    const subjectsTable = `
      CREATE TABLE IF NOT EXISTS subjects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        color TEXT NOT NULL
      );
    `;

    const notesTable = `
      CREATE TABLE IF NOT EXISTS notes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        subject_id INTEGER,
        title TEXT,
        content TEXT,
        FOREIGN KEY (subject_id) REFERENCES subjects (id) ON DELETE CASCADE
      );
    `;

    const tasksTable = `
      CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        description TEXT NOT NULL,
        date TEXT NOT NULL,
        time TEXT NOT NULL,
        completed BOOLEAN DEFAULT 0
      );
    `;

    await this.db.execute(subjectsTable);
    await this.db.execute(notesTable);
    await this.db.execute(tasksTable);
  }

  // Subjects
  async getSubjects(): Promise<Subject[]> {
    const result = await this.db.query('SELECT * FROM subjects');
    return result.values || [];
  }

  async addSubject(name: string, color: string): Promise<void> {
    await this.db.run('INSERT INTO subjects (name, color) VALUES (?, ?)', [name, color]);
  }

  async deleteSubject(id: number): Promise<void> {
    await this.db.run('DELETE FROM subjects WHERE id = ?', [id]);
  }

  // Notes
  async getNotesBySubject(subjectId: number): Promise<Note[]> {
    const result = await this.db.query('SELECT * FROM notes WHERE subject_id = ?', [subjectId]);
    return result.values || [];
  }

  async addNote(subjectId: number, title: string, content: string): Promise<void> {
    await this.db.run('INSERT INTO notes (subject_id, title, content) VALUES (?, ?, ?)', [subjectId, title, content]);
  }

  async updateNote(id: number, title: string, content: string): Promise<void> {
    await this.db.run('UPDATE notes SET title = ?, content = ? WHERE id = ?', [title, content, id]);
  }

  async deleteNote(id: number): Promise<void> {
    await this.db.run('DELETE FROM notes WHERE id = ?', [id]);
  }

  async getNoteById(id: number): Promise<Note | null> {
    const result = await this.db.query('SELECT * FROM notes WHERE id = ?', [id]);
    return result.values?.[0] || null;
  }

  // Tasks
  async getTasks(): Promise<Task[]> {
    const result = await this.db.query('SELECT * FROM tasks');
    return result.values || [];
  }

  async addTask(description: string, date: string, time: string): Promise<number> {
    const result = await this.db.run('INSERT INTO tasks (description, date, time) VALUES (?, ?, ?)', [description, date, time]);
    return result.changes?.lastId || 0;
  }

  async updateTask(id: number, completed: boolean): Promise<void> {
    await this.db.run('UPDATE tasks SET completed = ? WHERE id = ?', [completed ? 1 : 0, id]);
  }

  async deleteTask(id: number): Promise<void> {
    await this.db.run('DELETE FROM tasks WHERE id = ?', [id]);
  }

  async getUpcomingTasks(): Promise<Task[]> {
    const now = new Date();
    const twoHoursLater = new Date(now.getTime() + 2 * 60 * 60 * 1000);
    const dateStr = twoHoursLater.toISOString().split('T')[0];
    const timeStr = twoHoursLater.toTimeString().split(' ')[0].substring(0, 5);

    const result = await this.db.query(
      'SELECT * FROM tasks WHERE date = ? AND time <= ? AND completed = 0',
      [dateStr, timeStr]
    );
    return result.values || [];
  }

  // Notifications
  async scheduleTaskNotification(taskId: number, description: string, date: string, time: string): Promise<void> {
    const [year, month, day] = date.split('-').map(Number);
    const [hour, minute] = time.split(':').map(Number);
    const scheduleDate = new Date(year, month - 1, day, hour, minute);

    await LocalNotifications.schedule({
      notifications: [{
        id: taskId,
        title: 'Recordatorio de Tarea',
        body: description,
        schedule: { at: scheduleDate }
      }]
    });
  }

  async cancelTaskNotification(taskId: number): Promise<void> {
    await LocalNotifications.cancel({ notifications: [{ id: taskId }] });
  }
}