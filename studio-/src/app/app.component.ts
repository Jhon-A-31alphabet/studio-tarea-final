import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { DatabaseService } from './services/database.service';



@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  constructor(private dbService: DatabaseService) {
    this.initializeApp();
  }

  async initializeApp() {
    await this.dbService.initializeDatabase();
  }
}
