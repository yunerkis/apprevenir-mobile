import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { TestService } from '../../services/test.service';
import { ModalPage } from '../modals/modal/modal.page';
import { Router, NavigationEnd } from '@angular/router';


@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {

  tests = [];

  constructor(
    public modalController: ModalController,
    public testService: TestService,
    private router: Router
    
  ) {
    this.router.events.subscribe(event => {       
      if (event instanceof NavigationEnd && event.url == '/home') {
        this.testService.test.next([])
      }
    });
  }

  ngOnInit() {
    this.testService.getTestsList().then( res => { 
      res.subscribe(tests => { this.tests = tests['data'] }, data => {
        if (data.error.data == 'disabled') {
          this.testService.userDelete()
        }
        console.log(data.error);
      });
    });
  }

  async openModal(contents) {
    const modal = await this.modalController.create({
      component: ModalPage,
      cssClass: 'modal-terms',
      componentProps: {
        "contents": contents,
      }
    });

    return await modal.present();
  }
}
