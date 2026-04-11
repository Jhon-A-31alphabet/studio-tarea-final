import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },
  {
    path: 'note-list',
    loadComponent: () => import('./note-list/note-list.page').then( m => m.NoteListPage)
  },
  {
    path: 'notepad',
    loadComponent: () => import('./notepad/notepad.page').then( m => m.NotepadPage)
  },
  {
    path: 'notepad',
    loadComponent: () => import('./notepad/notepad.page').then( m => m.NotepadPage)
  },
  
];
