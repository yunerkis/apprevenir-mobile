import { Component } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { AuthGuardService } from '../../services/auth-guard.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  constructor(
    private menu: MenuController,
    private authGuardService: AuthGuardService,
  ) {}

  openFirst() {
    this.menu.enable(true, 'first');
    this.menu.open('first');
  }

  openEnd() {  
    this.menu.close();
  }

  logout() {
    this.authGuardService.logout();
  }
}
