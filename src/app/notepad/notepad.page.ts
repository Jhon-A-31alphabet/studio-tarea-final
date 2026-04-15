import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonIcon, IonTextarea, IonButtons, IonButton, IonCard, IonCardContent, IonLabel } from '@ionic/angular/standalone';
import { Router } from '@angular/router'; 
import { addIcons } from 'ionicons';
import { arrowBackOutline, checkmarkDoneOutline } from 'ionicons/icons';
import { ActivatedRoute } from '@angular/router';
import { DatabaseService, Note } from '../services/database.service';

@Component({
  selector: 'app-notepad',
  templateUrl: './notepad.page.html',
  styleUrls: ['./notepad.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonItem, IonIcon, IonTextarea, IonButtons, IonButton, IonCard, IonCardContent, IonLabel]
})
export class NotepadPage implements OnInit {

  noteId: number | null = null;
  subjectId: number = 0;
  title: string = '';
  content: string = '';
  createdAt: string = '';
  updatedAt: string = '';

  constructor(private router_: Router, private route: ActivatedRoute, private dbService: DatabaseService) { 
    addIcons({ arrowBackOutline, checkmarkDoneOutline });
  }

  async ngOnInit() {
    this.route.queryParams.subscribe(async params => {
      const noteIdParam = params['noteId'];
      const subjectIdParam = params['subjectId'];
      
      if (noteIdParam) {
        this.noteId = +noteIdParam;
      }
      
      if (subjectIdParam) {
        this.subjectId = +subjectIdParam;
      }
      
      console.log('NotepadPage params - noteId:', this.noteId, 'subjectId:', this.subjectId);
      
      if (this.noteId) {
        await this.loadNote();
      }
    });
  }

  async loadNote() {
    if (this.noteId) {
      const note = await this.dbService.getNoteById(this.noteId);
      if (note) {
        this.title = note.title;
        this.content = note.content;
        this.createdAt = note.createdAt;
        this.updatedAt = note.updatedAt;
      }
    }
  }

  async saveNote() {
    // Validar que hay contenido que guardar
    if (!this.title.trim() && !this.content.trim()) {
      console.warn('Intento de guardar nota vacía');
      alert('Por favor, escribe un título o contenido para la nota');
      return;
    }

    console.log('Guardando nota - noteId:', this.noteId, 'subjectId:', this.subjectId);

    if (this.noteId) {
      console.log('Actualizando nota existente');
      await this.dbService.updateNote(this.noteId, this.title, this.content);
    } else if (this.subjectId > 0) {
      console.log('Creando nueva nota en materia:', this.subjectId);
      await this.dbService.addNote(this.subjectId, this.title, this.content);
    } else {
      console.error('No se puede guardar: falta subjectId');
      alert('Error: No se pudo identificar la materia');
    }
  }

  async guardarNota() {
    await this.saveNote();
    await this.regresar_a_lista_notas();
  }

  async regresar_a_lista_notas(){
    // Agregar un pequeño delay para asegurar que se guardó
    await new Promise(resolve => setTimeout(resolve, 100));
    this.router_.navigate(['/note-list'], { queryParams: { subjectId: this.subjectId } });
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return date.toLocaleDateString('es-ES', options);
  }
}
