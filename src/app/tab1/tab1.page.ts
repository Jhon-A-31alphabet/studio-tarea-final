import { Component, OnInit, OnDestroy } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonText, IonItem, IonLabel, IonCheckbox, IonIcon } from '@ionic/angular/standalone';
import { DatePipe, CommonModule } from '@angular/common';
import { DatabaseService, Task } from '../services/database.service';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  imports: [
    IonHeader, IonToolbar, IonTitle, IonContent, IonText, IonCard, IonCardContent, 
    IonCardHeader, IonCardTitle, DatePipe, CommonModule, IonItem, 
    IonLabel, IonCheckbox, IonIcon
  ],
})
export class Tab1Page implements OnInit, OnDestroy {

  fechaactual: Date = new Date();
  upcomingTasks: Task[] = [];
  private refreshInterval: any;

  constructor(
    private dbService: DatabaseService,
    private notificationService: NotificationService
  ) {}

  async ngOnInit() { 
    await this.dbService.initializeDatabase();
    await this.notificationService.init();
    this.fechaactual = new Date();
    await this.loadUpcomingTasks();
    
    // Actualizar cada 30 segundos
    this.refreshInterval = setInterval(() => {
      this.loadUpcomingTasks();
    }, 30000);
  }

  ngOnDestroy() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  }

  async loadUpcomingTasks() {
    this.fechaactual = new Date();
    const allTasks = await this.dbService.getTasks();
    
    // Filtrar solo tareas incompletas que vencen en menos de 2 horas
    const now = new Date();
    this.upcomingTasks = allTasks.filter(task => {
      if (task.completed) return false;
      
      const taskDate = new Date(`${task.date}T${task.time}`);
      const twoHoursFromNow = new Date(now.getTime() + 2 * 60 * 60 * 1000);
      
      return taskDate > now && taskDate <= twoHoursFromNow;
    });
    
    console.log('Tareas que vencen en menos de 2 horas:', this.upcomingTasks);
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
    
    // Recargar tareas (la tarea desaparecera porque ya esta completada)
    await this.loadUpcomingTasks();
  }
}
