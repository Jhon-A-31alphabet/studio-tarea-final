import { Component, OnInit, OnDestroy } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonText, IonItem, IonLabel, IonCheckbox, IonIcon, IonButton } from '@ionic/angular/standalone';
import { DatePipe, CommonModule } from '@angular/common';
import { DatabaseService, Task, Note } from '../services/database.service';
import { NotificationService } from '../services/notification.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  imports: [
    IonHeader, IonToolbar, IonTitle, IonContent, IonText, IonCard, IonCardContent, 
    IonCardHeader, IonCardTitle, DatePipe, CommonModule, IonItem, 
    IonLabel, IonCheckbox, IonIcon, IonButton
  ],
})
export class Tab1Page implements OnInit, OnDestroy {

  userName: string = 'Usuario';
  fechaactual: Date = new Date();
  upcomingTasks: Task[] = [];
  recentNotes: Note[] = [];
  tasksProgress = { completed: 0, total: 0, percentage: 0 };
  private refreshInterval: any;

  constructor(
    private dbService: DatabaseService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  async ngOnInit() { 
    await this.dbService.initializeDatabase();
    await this.notificationService.init();
    this.fechaactual = new Date();
    await this.loadDashboardData();
    
    // Actualizar cada 30 segundos
    this.refreshInterval = setInterval(() => {
      this.loadDashboardData();
    }, 30000);
  }

  ngOnDestroy() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  }

  async loadDashboardData() {
    this.fechaactual = new Date();
    
    // Obtener nombre del usuario
    this.userName = await this.dbService.getUserName();
    
    // Obtener tareas próximas a vencer en menos de 2 horas
    const allTasks = await this.dbService.getTasks();
    const now = new Date();
    this.upcomingTasks = allTasks.filter(task => {
      if (task.completed) return false;
      
      const taskDate = new Date(`${task.date}T${task.time}`);
      const twoHoursFromNow = new Date(now.getTime() + 2 * 60 * 60 * 1000);
      
      return taskDate > now && taskDate <= twoHoursFromNow;
    });
    
    // Obtener notas recientes
    this.recentNotes = await this.dbService.getRecentNotes(2);
    
    // Obtener progreso de tareas
    this.tasksProgress = await this.dbService.getTasksProgress();
    
    console.log('Dashboard data loaded:', {
      userName: this.userName,
      upcomingTasks: this.upcomingTasks,
      recentNotes: this.recentNotes,
      tasksProgress: this.tasksProgress
    });
  }

  async toggleCompletada(task: Task) {
    // Marcar como completada
    await this.dbService.updateTask(task.id, true);
    
    // Mostrar notificacion
    await this.notificationService.programar(
      'Tarea Completada',
      `Excelente! La tarea "${task.description}" ha sido completada!`,
      new Date().toISOString().split('T')[0],
      new Date().toTimeString().split(' ')[0].substring(0, 5)
    );
    
    alert(`Excelente! Tarea "${task.description}" completada`);
    
    // Recargar datos del dashboard
    await this.loadDashboardData();
  }

  viewAllTasks() {
    this.router.navigate(['/tabs/tab3']);
  }

  viewAllNotes() {
    this.router.navigate(['/tabs/tab2']);
  }
}
