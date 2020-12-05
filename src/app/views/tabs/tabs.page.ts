import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { AuthGuardService } from '../../services/auth-guard.service';
import { LoaderService } from '../../services/loader.service';


@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage implements OnInit {

  constructor(
    private menu: MenuController,
    private authGuardService: AuthGuardService,
    private ionLoader: LoaderService
  ) {}

  ngOnInit() {
    // this.ionLoader.showHideAutoLoader();
  }

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
