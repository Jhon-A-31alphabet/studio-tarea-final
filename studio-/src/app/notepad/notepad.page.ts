import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar,IonItem,IonIcon } from '@ionic/angular/standalone';
import { Router } from '@angular/router'; 
import { addIcons } from 'ionicons';
import { arrowBackOutline } from 'ionicons/icons';
import { IonTextarea } from '@ionic/angular/standalone';
import { ActivatedRoute } from '@angular/router';
import { DatabaseService, Note } from '../services/database.service';

@Component({
  selector: 'app-notepad',
  templateUrl: './notepad.page.html',
  styleUrls: ['./notepad.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule,IonItem,IonIcon,IonTextarea]
})
export class NotepadPage implements OnInit {

  noteId: number | null = null;
  subjectId: number = 0;
  title: string = '';
  content: string = '';

  constructor(private router_:Router, private route: ActivatedRoute, private dbService: DatabaseService) { 
    addIcons({arrowBackOutline});
  }

  async ngOnInit() {
    this.route.queryParams.subscribe(async params => {
      this.noteId = params['noteId'] ? +params['noteId'] : null;
      this.subjectId = params['subjectId'] ? +params['subjectId'] : 0;
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
      }
    }
  }

  async saveNote() {
    if (this.noteId) {
      await this.dbService.updateNote(this.noteId, this.title, this.content);
    } else if (this.subjectId) {
      await this.dbService.addNote(this.subjectId, this.title, this.content);
    }
  }

  async regresar_a_lista_notas(){
    await this.saveNote();
    this.router_.navigate(['/note-list'], { queryParams: { subjectId: this.subjectId } });
  }
}
