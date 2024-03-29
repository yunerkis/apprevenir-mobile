import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ModalPage } from '../modal/modal.page';
import { Modal2Page } from '../modal2/modal.page';


@Component({
  selector: 'app-terms',
  templateUrl: './terms.page.html',
  styleUrls: ['./terms.page.scss'],
})

export class TermsPage implements OnInit {

  constructor(public modalController: ModalController) { }

  ngOnInit() {
  }

  async openModal(terms) {
    const modal = await this.modalController.create({
      component: ModalPage,
      cssClass: 'modal-terms',
      componentProps: {
        "terms": terms,
      }
    });

    return await modal.present();
  }
  
  async openModal2(terms) {
    const modal = await this.modalController.create({
      component: Modal2Page,
      cssClass: 'modal-terms',
      componentProps: {
        "terms": terms,
      }
    });

    return await modal.present();
  }

}
