import { Component, ViewChild } from '@angular/core';
// Agregamos IonButtons a la lista de abajo
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, 
  IonCard, IonCardHeader, IonCardTitle, IonModal,
  IonFab, IonFabButton, IonIcon, IonButton, 
   IonInput, IonItem, IonLabel,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { add,trash } from 'ionicons/icons';
import { Router } from '@angular/router'; // Importa Router
import { Title } from '@angular/platform-browser';
import { DatabaseService, Subject } from '../services/database.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true, // Asegúrate de que tenga esto si es standalone
  imports: [
    IonHeader, IonToolbar, IonTitle, IonContent, IonCard, 
    IonCardHeader, IonCardTitle, IonFab, IonFabButton, 
    IonIcon, IonModal, IonButton, IonInput, 
    IonItem, IonLabel, FormsModule, CommonModule,
  ]
})
export class Tab2Page {
  // Usamos el decorador para capturar la instancia del modal del HTML
  @ViewChild(IonModal) modal!: IonModal;

  subjects: Subject[] = [];
  newSubjectName: string = '';
  newSubjectColor: string = '#000000';

  constructor(private router:Router, private dbService: DatabaseService) {
    addIcons({ add });
    addIcons({trash})
  }

  async ngOnInit(){ // aqui deberas ejecutar la query sql para mostrar todas las materias almacenadas y con el view engine de angular
    //mostrarlas y estilizarlas en la pagina tab2.page.html
    await this.loadSubjects();
  }

  async loadSubjects() {
    this.subjects = await this.dbService.getSubjects();
  }

  cancelar() {
    this.modal.dismiss(null, 'cancel');
    this.newSubjectName = '';
    this.newSubjectColor = '#000000';
  }

  async aceptar() {
    if (this.newSubjectName.trim()) {
      await this.dbService.addSubject(this.newSubjectName, this.newSubjectColor);
      await this.loadSubjects();
      this.cancelar();
    }
  }

  abrir_lista_notas(subject: Subject){
    this.router.navigate(['/note-list'],{queryParams:{title: subject.name, subjectId: subject.id}});
  }

  async deleteSubject(subject: Subject) {
    await this.dbService.deleteSubject(subject.id);
    await this.loadSubjects();
  }
}