import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import{IonToolbar,IonTitle,IonContent,IonHeader,IonCard,IonCardTitle,
  IonCardContent,IonCardHeader,IonItem,IonFab,IonFabButton,
  IonIcon} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBackOutline,trash } from 'ionicons/icons';
import { Router } from '@angular/router'; 

@Component({
  selector: 'app-note-list',
  templateUrl: './note-list.page.html',
  styleUrls: ['./note-list.page.scss'],
  imports:[IonToolbar,IonTitle,IonContent,IonHeader,IonCard,IonCardTitle,
    IonCardContent,IonCardHeader,IonCard,IonItem,
  IonIcon,IonFab,IonFabButton],
})

export class NoteListPage implements OnInit {
  title: string = 'None';

  constructor(private route: ActivatedRoute,private router:Router) {
    addIcons({arrowBackOutline});
    addIcons({trash})
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.title = params['title'] || this.title; // Asigna un valor por defecto si no hay título
    });
  }

  regresar_a_materias(){
    this.router.navigate(['/tabs/tab2']);
  }

  abrir_bloc_notas(){
    this.router.navigate(['/notepad'])
  }
}

