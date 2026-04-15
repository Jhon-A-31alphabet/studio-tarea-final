import { Component, OnInit, OnDestroy } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';
import {  IonText } from '@ionic/angular/standalone';
import { IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle } from '@ionic/angular/standalone';
import { DatePipe } from '@angular/common';
import { DatabaseService, Task } from '../services/database.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent,IonText,IonCard,IonCardContent,IonCardHeader,IonCardTitle,IonCardSubtitle,DatePipe, CommonModule],
})
export class Tab1Page implements OnInit, OnDestroy {

  fechaactual : Date = new Date();
  upcomingTasks: Task[] = [];
  private refreshInterval: any;

  constructor(private dbService: DatabaseService) {}

  async ngOnInit() { 
    await this.dbService.initializeDatabase();
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
    
    // Filtrar solo tareas que vencen en menos de 2 horas
    const now = new Date();
    this.upcomingTasks = allTasks.filter(task => {
      if (task.completed) return false;
      
      const taskDate = new Date(`${task.date}T${task.time}`);
      const twoHoursFromNow = new Date(now.getTime() + 2 * 60 * 60 * 1000);
      
      return taskDate > now && taskDate <= twoHoursFromNow;
    });
    
    console.log('Tareas que vencen en menos de 2 horas:', this.upcomingTasks);
  }
}
