import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';
import {IonFab, IonFabButton} from'@ionic/angular/standalone';
import { IonCard, IonModal} from '@ionic/angular/standalone';
import { DatePipe } from '@angular/common';
import { IonCheckbox,IonItem,IonIcon,IonInput,IonLabel,IonButton,IonDatetime } from '@ionic/angular/standalone';
import { ViewChild  } from '@angular/core';

import { addIcons } from 'ionicons';
import { trash } from 'ionicons/icons';
import { DatabaseService, Task } from '../services/database.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonFab,
    IonFabButton,IonCard,IonModal,
    DatePipe,IonCheckbox,IonItem,IonIcon,IonInput,IonLabel,IonButton,IonDatetime, FormsModule, CommonModule],
})
export class Tab3Page {
  @ViewChild(IonModal) modal!: IonModal;

    fechaactual : Date =new Date();
    tasks: Task[] = [];
    newTaskDescription: string = '';
    newTaskDateTime: string = '';

  constructor(private dbService: DatabaseService) {

    addIcons({ trash });

  }

  async ngOnInit() {
    await this.loadTasks();
  }


  // Función para cerrar el modal sin guardar
  cancelar() {
    this.modal.dismiss(null, 'cancel');
    this.newTaskDescription = '';
    this.newTaskDateTime = '';
  }

  // Función para confirmar y cerrar el modal
  async aceptar() {   
    if (this.newTaskDescription.trim() && this.newTaskDateTime) {
      const date = new Date(this.newTaskDateTime);
      const dateStr = date.toISOString().split('T')[0];
      const timeStr = date.toTimeString().split(' ')[0].substring(0, 5);
      const taskId = await this.dbService.addTask(this.newTaskDescription, dateStr, timeStr);
      await this.dbService.scheduleTaskNotification(taskId, this.newTaskDescription, dateStr, timeStr);
      await this.loadTasks();
      this.cancelar();
    }
  }

  async loadTasks() {
    this.tasks = await this.dbService.getTasks();
  }

  async toggleTask(task: Task) {
    await this.dbService.updateTask(task.id, task.completed);
  }

  async deleteTask(task: Task) {
    await this.dbService.cancelTaskNotification(task.id);
    await this.dbService.deleteTask(task.id);
    await this.loadTasks();
  }
}
