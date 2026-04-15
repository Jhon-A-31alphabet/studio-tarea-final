import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import{IonToolbar,IonTitle,IonContent,IonHeader,IonCard,IonCardTitle,
  IonCardContent,IonCardHeader,IonItem,IonFab,IonFabButton,
  IonIcon,IonButton,IonCardSubtitle,IonButtons} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBackOutline,trash,documentTextOutline } from 'ionicons/icons';
import { Router } from '@angular/router'; 
import { DatabaseService, Note } from '../services/database.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-note-list',
  templateUrl: './note-list.page.html',
  styleUrls: ['./note-list.page.scss'],
  imports:[IonToolbar,IonTitle,IonContent,IonHeader,IonCard,IonCardTitle,
    IonCardContent,IonCardHeader,IonCard,IonItem,IonButton,IonCardSubtitle,IonButtons,
  IonIcon,IonFab,IonFabButton, CommonModule],
})

export class NoteListPage implements OnInit {
  title: string = 'None';
  subjectId: number = 0;
  notes: Note[] = [];

  constructor(private route: ActivatedRoute,private router:Router, private dbService: DatabaseService) {
    addIcons({arrowBackOutline,trash,documentTextOutline});
  }

  async ngOnInit() {
    this.route.queryParams.subscribe(async params => {
      this.title = params['title'] || this.title;
      this.subjectId = params['subjectId'] || 0;
      if (this.subjectId) {
        await this.loadNotes();
      }
    });
  }

  async loadNotes() {
    this.notes = await this.dbService.getNotesBySubject(this.subjectId);
  }

  regresar_a_materias(){
    this.router.navigate(['/tabs/tab2']);
  }

  abrir_bloc_notas(note?: Note){
    if (note) {
      this.router.navigate(['/notepad'], { queryParams: { noteId: note.id } });
    } else {
      this.router.navigate(['/notepad'], { queryParams: { subjectId: this.subjectId } });
    }
  }

  async deleteNote(note: Note) {
    await this.dbService.deleteNote(note.id);
    await this.loadNotes();
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

