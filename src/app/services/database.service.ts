import { Injectable } from '@angular/core';
import { LocalNotifications } from '@capacitor/local-notifications';

// Interfaces
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
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: number;
  description: string;
  date: string;
  time: string;
  completed: boolean;
  subject_id: number;
}

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private subjects: Subject[] = [];
  private notes: Note[] = [];
  private tasks: Task[] = [];
  private nextSubjectId = 1;
  private nextNoteId = 1;
  private nextTaskId = 1;

  constructor() {
    this.loadDataFromLocalStorage();
  }

  async initializeDatabase(): Promise<void> {
    this.loadDataFromLocalStorage();
  }

  private loadDataFromLocalStorage(): void {
    const subjectsData = localStorage.getItem('subjects');
    const notesData = localStorage.getItem('notes');
    const tasksData = localStorage.getItem('tasks');

    if (subjectsData) {
      this.subjects = JSON.parse(subjectsData);
      this.nextSubjectId = Math.max(...this.subjects.map(s => s.id), 0) + 1;
    }
    if (notesData) {
      this.notes = JSON.parse(notesData);
      this.nextNoteId = Math.max(...this.notes.map(n => n.id), 0) + 1;
    }
    if (tasksData) {
      this.tasks = JSON.parse(tasksData);
      this.nextTaskId = Math.max(...this.tasks.map(t => t.id), 0) + 1;
    }
  }

  private saveToLocalStorage(): void {
    localStorage.setItem('subjects', JSON.stringify(this.subjects));
    localStorage.setItem('notes', JSON.stringify(this.notes));
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
  }

  // Subjects
  async getSubjects(): Promise<Subject[]> {
    return this.subjects;
  }

  async addSubject(name: string, color: string): Promise<void> {
    const newSubject: Subject = {
      id: this.nextSubjectId++,
      name,
      color
    };
    this.subjects.push(newSubject);
    this.saveToLocalStorage();
  }

  async deleteSubject(id: number): Promise<void> {
    this.subjects = this.subjects.filter(s => s.id !== id);
    this.notes = this.notes.filter(n => n.subject_id !== id);
    this.saveToLocalStorage();
  }

  // Notes
  async getNotesBySubject(subjectId: number): Promise<Note[]> {
    return this.notes.filter(n => n.subject_id === subjectId);
  }

  async addNote(subjectId: number, title: string, content: string): Promise<void> {
    const now = new Date().toISOString();
    const newNote: Note = {
      id: this.nextNoteId++,
      subject_id: subjectId,
      title,
      content,
      createdAt: now,
      updatedAt: now
    };
    this.notes.push(newNote);
    this.saveToLocalStorage();
  }

  async updateNote(id: number, title: string, content: string): Promise<void> {
    const note = this.notes.find(n => n.id === id);
    if (note) {
      note.title = title;
      note.content = content;
      note.updatedAt = new Date().toISOString();
      this.saveToLocalStorage();
    }
  }

  async deleteNote(id: number): Promise<void> {
    this.notes = this.notes.filter(n => n.id !== id);
    this.saveToLocalStorage();
  }

  async getNoteById(id: number): Promise<Note | null> {
    return this.notes.find(n => n.id === id) || null;
  }

  // Tasks
  async getTasks(): Promise<Task[]> {
    return this.tasks;
  }

  async addTask(description: string, date: string, time: string, subject_id: number): Promise<number> {
    const newTask: Task = {
      id: this.nextTaskId++,
      description,
      date,
      time,
      completed: false,
      subject_id
    };
    this.tasks.push(newTask);
    this.saveToLocalStorage();
    return newTask.id;
  }

  async updateTask(id: number, completed: boolean): Promise<void> {
    const task = this.tasks.find(t => t.id === id);
    if (task) {
      task.completed = completed;
      this.saveToLocalStorage();
    }
  }

  async deleteTask(id: number): Promise<void> {
    this.tasks = this.tasks.filter(t => t.id !== id);
    this.saveToLocalStorage();
  }

  async getUpcomingTasks(): Promise<Task[]> {
    const now = new Date();
    const twoHoursLater = new Date(now.getTime() + 2 * 60 * 60 * 1000);
    const dateStr = twoHoursLater.toISOString().split('T')[0];
    const timeStr = twoHoursLater.toTimeString().split(' ')[0].substring(0, 5);

    return this.tasks.filter(t => 
      t.date === dateStr && t.time <= timeStr && !t.completed
    );
  }

  // Notifications
  async scheduleTaskNotification(taskId: number, description: string, date: string, time: string): Promise<void> {
    try {
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
    } catch (error) {
      console.error('Error scheduling notification:', error);
    }
  }

  async cancelTaskNotification(taskId: number): Promise<void> {
    try {
      await LocalNotifications.cancel({ notifications: [{ id: taskId }] });
    } catch (error) {
      console.error('Error canceling notification:', error);
    }
  }

  // Compatibility methods for tab3 component
  async obtenerTareas(): Promise<any[]> {
    return this.tasks.map(t => ({
      id: t.id,
      descripcion: t.description,
      fecha: t.date,
      hora: t.time,
      completada: t.completed ? 1 : 0,
      notificacion_id: t.id,
      subject_id: t.subject_id
    }));
  }

  async agregarTarea(descripcion: string, fecha: string, hora: string, notificacionId: number, subject_id: number): Promise<void> {
    await this.addTask(descripcion, fecha, hora, subject_id);
  }

  async eliminarTarea(id: number): Promise<void> {
    await this.deleteTask(id);
  }

  async actualizarTareaCompletada(id: number, completada: number): Promise<void> {
    await this.updateTask(id, completada === 1);
  }
}