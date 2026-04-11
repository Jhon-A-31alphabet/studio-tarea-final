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
      this.fechaactual = new Date();  // conseguir la fecha actual
    };
  }


  // Función para cerrar el modal sin guardar
  cancelar() {
    this.modal.dismiss(null, 'cancel');
  }

  // Función para confirmar y cerrar el modal
  aceptar() {   
    console.log('Materia aceptada');
    this.modal.dismiss(null, 'confirm');   // el codigo mostrado aqui no sirve para nada, se utilizo de ejemplo,
                                           // dentro de esta funcion se debera guardar la tarea en la base de datos sqlite y ademas
                                           // se debera programar el taskscheduler del sistema operativo para cuando llegue esa fecha y hora
                                           // se dispare una notificacion
                                           //ademas se debera crear un ioncard con el formato visto en el archivo tab3.page.html el cual contenga
                                           //todos los elementos mostrados de ejemplo.  ( ve al archivo tab3.page.html y mira el ejemplo )

  }

}
