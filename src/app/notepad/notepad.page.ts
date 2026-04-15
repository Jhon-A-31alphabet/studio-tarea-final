import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar,IonItem,IonIcon } from '@ionic/angular/standalone';
import { Router } from '@angular/router'; 
import { addIcons } from 'ionicons';
import { arrowBackOutline } from 'ionicons/icons';
import { IonTextarea } from '@ionic/angular/standalone';
@Component({
  selector: 'app-notepad',
  templateUrl: './notepad.page.html',
  styleUrls: ['./notepad.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule,IonItem,IonIcon,IonTextarea]
})
export class NotepadPage implements OnInit {

  constructor(private router_:Router) { 
    addIcons({arrowBackOutline});
  }

  ngOnInit() {
  }

  regresar_a_lista_notas(){
    this.router_.navigate(['/note-list']);

  }

}
