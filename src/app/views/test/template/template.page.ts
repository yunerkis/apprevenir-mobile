import { Component, OnInit } from '@angular/core';
import { TestService } from '../../../services/test.service';
import { ModalController } from '@ionic/angular';
import { ModalPage } from '../../modals/modal/modal.page';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-template',
  templateUrl: './template.page.html',
  styleUrls: ['./template.page.scss'],
})
export class TemplatePage implements OnInit {

  infoTest: any = [];
  url = environment.url;

  constructor(
    public testService: TestService,
    public modalController: ModalController,
  ) {}

  ngOnInit() {
    this.testService.test.subscribe( (val) => this.infoTest = val);
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
