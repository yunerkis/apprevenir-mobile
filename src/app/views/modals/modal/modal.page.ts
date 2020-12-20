import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.page.html',
  styleUrls: ['./modal.page.scss'],
})
export class ModalPage implements OnInit {
  
  content: any;
  addiction: FormGroup;
  url = environment.url;

  constructor(
    private modalController: ModalController,
    private navParams: NavParams,
    private formBuilder: FormBuilder,
    private router: Router,
  ) { }

  ngOnInit() {
    this.content = this.navParams.data.contents;

    this.addiction = this.formBuilder.group({
      addiction_id: ['', Validators.required],
    });
  }

  async closeModal() {
    const onClosedData: string = "Wrapped Up!";
    await this.modalController.dismiss(onClosedData);
  }

  onSubmit(id) {
    if(!this.addiction.invalid) {
      this.closeModal()
      let addiction = this.addiction.value.addiction_id
      let res = addiction.split(" ");
      this.router.navigate(['/test/test/'+id], { queryParams: { addiction_id: res[0], addiction :res[1]  } });
    }
  }

}
