import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';
import {IonFab, IonFabButton} from'@ionic/angular/standalone';
import { IonCard, IonModal} from '@ionic/angular/standalone';
import { DatePipe } from '@angular/common';
import { IonCheckbox,IonItem,IonIcon,IonInput,IonLabel,IonButton,IonDatetime } from '@ionic/angular/standalone';
import { ViewChild  } from '@angular/core';

import { addIcons } from 'ionicons';
import { trash } from 'ionicons/icons';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonFab,
    IonFabButton,IonCard,IonModal,
    DatePipe,IonCheckbox,IonItem,IonIcon,IonInput,IonLabel,IonButton,IonDatetime],
})
export class Tab3Page {
  @ViewChild(IonModal) modal!: IonModal;

    fechaactual : Date =new Date();

  constructor() {

    addIcons({ trash });

  }

  ngOnInit() {
    () => {
      this.fechaactual = new Date();
    };
  }


  // Función para cerrar el modal sin guardar
  cancelar() {
    this.modal.dismiss(null, 'cancel');
  }

  // Función para confirmar y cerrar el modal
  aceptar() {
    console.log('Materia aceptada');
    this.modal.dismiss(null, 'confirm');
  }

}
