import { Component,ViewChild  } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import {  IonText } from '@ionic/angular/standalone';
import { IonCard, IonCardHeader, IonCardTitle,
  IonModal } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { add } from 'ionicons/icons';
import {IonFab, IonFabButton} from'@ionic/angular/standalone';
import {  IonIcon,IonButton, IonInput,IonItem,IonLabel} from '@ionic/angular/standalone';




@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, ExploreContainerComponent,IonText,IonCard,IonCardHeader,IonCardTitle,IonFab,
    IonFabButton,IonIcon,IonModal,IonButton,IonInput,IonItem,IonLabel]
})
export class Tab2Page {
@ViewChild(IonModal) modal!: IonModal;

  constructor() {
    addIcons({add});
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
