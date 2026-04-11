import { Component, ViewChild } from '@angular/core';
// Agregamos IonButtons a la lista de abajo
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, 
  IonCard, IonCardHeader, IonCardTitle, IonModal,
  IonFab, IonFabButton, IonIcon, IonButton, 
   IonInput, IonItem, IonLabel,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { add } from 'ionicons/icons';
import { Router } from '@angular/router'; // Importa Router
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true, // Asegúrate de que tenga esto si es standalone
  imports: [
    IonHeader, IonToolbar, IonTitle, IonContent, IonCard, 
    IonCardHeader, IonCardTitle, IonFab, IonFabButton, 
    IonIcon, IonModal, IonButton, IonInput, 
    IonItem, IonLabel,
  ]
})
export class Tab2Page {
  // Usamos el decorador para capturar la instancia del modal del HTML
  @ViewChild(IonModal) modal!: IonModal;

  constructor(private router:Router) {
    addIcons({ add });
  }

  ngOnInit(){ // aqui deberas ejecutar la query sql para mostrar todas las materias almacenadas y con el view engine de angular
    //mostrarlas y estilizarlas en la pagina tab2.page.html

  }


  cancelar() {
    this.modal.dismiss(null, 'cancel');
  }

  aceptar() {
    // Aquí deberas capturar el nombre de la materia creada y guardarla en la base de datos sqlite.
    console.log('Materia aceptada');
    this.modal.dismiss(null, 'confirm');
  }

  abrir_lista_notas(){
    const materia = "nombre de la materia ";   // <-- aqui se debera capturar el nombre de la materia para asi colocar en el iontitle
                                                // el nombre de la materia
    this.router.navigate(['/note-list'],{queryParams:{title:materia}});
  }


}