import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import {  IonText } from '@ionic/angular/standalone';
import { IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle } from '@ionic/angular/standalone';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, ExploreContainerComponent,IonText,IonCard,IonCardContent,IonCardHeader,IonCardTitle,IonCardSubtitle,DatePipe],
})
export class Tab1Page {
  fechaactual : Date =new Date();
  constructor() {}

  ngOnInit() {
    () => {
      this.fechaactual = new Date();
    };
  }
}
