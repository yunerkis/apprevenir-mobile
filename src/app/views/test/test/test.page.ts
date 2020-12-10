import { Component, OnInit } from '@angular/core';
import { TestService } from '../../../services/test.service';
import { ActivatedRoute } from "@angular/router";
import { FormGroup, FormBuilder, FormControl, Validators, AbstractControl, FormArray  } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { ModalPage } from '../../modals/modal/modal.page';
import { LoaderService } from '../../../services/loader.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-test',
  templateUrl: './test.page.html',
  styleUrls: ['./test.page.scss'],
})
export class TestPage implements OnInit {

  test = [];
  start = true;
  formGroup: FormGroup;
  answers = [];
  answer = {};
  addiction = null;
  url = environment.url;
  questions: any;
  order = {
    0:"a",
    1:"b",
    2:"c",
    3:"d",
    4:"e",
    5:"f",
    6:"g",
    7:"h",
    8:"i",
    9:"j",
    10:"k",
    11:"l",
    12:"m",
  };

  get formArray(): AbstractControl | null { return this.formGroup.get('formArray'); }

  constructor(
    public testService: TestService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    public modalController: ModalController,
    public loaderService: LoaderService
  ) { }
  

  ngOnInit() {

    this.loaderService.showHideAutoLoader();

    this.formGroup = this.formBuilder.group({formArray: this.formBuilder.array([])});

    const id = this.route.snapshot.paramMap.get("id");

    this.testService.getTest(id).then( res => { 
      res.subscribe(test => {
        this.test = test['data'];
        this.questions =  this.test['questions'];
        this.testService.test.next(this.test);
        this.test['questions'].forEach((question, i) => {
          this.answer = {};
          this.answer['answer_'+i] = ['', Validators.required];
          this.answers.push(this.formBuilder.group(this.answer));
        });
        this.formGroup = this.formBuilder.group({ formArray: this.formBuilder.array(this.answers) });
        this.openModal(this.test, true);
      }, data => {
        if (data.error.data == 'disabled') {
          this.testService.userDelete()
        }
        console.log(data.error);
      });
    });
  }

  onSubmit() {
    let arrayAnswers =  this.formGroup.value.formArray;
    let key = 'answer_';
    let objAnswers = [];
    arrayAnswers.forEach((e, i) => {
      objAnswers.push(e[key+i]);
    });

    let result = {
      'test_id': this.test['id'],
      'answers':objAnswers,
      'addiction_id': this.route.snapshot.paramMap.get("addiction_id")
    }

    this.testService.storeAnswer(result);
  }

  async openModal(contents, start = false) {
    const modal = await this.modalController.create({
      component: ModalPage,
      cssClass: 'modal-terms',
      componentProps: {
        "contents": contents,
        "start": start
      }
    });

    return await modal.present();
  }
}
