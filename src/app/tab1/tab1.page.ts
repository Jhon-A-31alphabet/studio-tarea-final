import { Component } from '@angular/core';
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
export class Tab1Page {

  fechaactual : Date =new Date();
  upcomingTasks: Task[] = [];

  constructor(private dbService: DatabaseService) {}

  async ngOnInit() { 
    this.fechaactual = new Date();
    await this.loadUpcomingTasks();
  }

  async loadUpcomingTasks() {
    this.upcomingTasks = await this.dbService.getUpcomingTasks();
  }
}
