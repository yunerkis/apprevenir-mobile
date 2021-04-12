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

  addiction = null;
  addiction_id = false;
  addictionArray = []
  test = [];
  start = true;
  formGroup: FormGroup;
  answers = [];
  answer = {};
  url = environment.url+'/storage';
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

    const addiction = this.route.snapshot.queryParamMap.get("addiction");
    
    this.testService.getTest(id).then( res => { 
      res.subscribe(test => {
        this.test = test['data'];
        this.questions =  this.test['questions'].map((question, i)=>{
          this.answer = {};

          if (i == 0 && this.test['name'] == 'Drogas') {
            this.answer['addiction'] = ['', Validators.required];
          } else if (this.test['name'] == 'Drogas') {
            this.test['addictions'].map((addiction) => {
              this.answer['answer_'+addiction.id+'_'+i] = ['', Validators.required];
            });
          } else {
            this.answer['answer_'+i] = ['', Validators.required];
          }
          
          this.answers.push(this.formBuilder.group(this.answer));
          
          if (addiction != null) {
            question.question = question.question.replace('varI', addiction);
          }
          
          return question;
        });
        this.testService.test.next(this.test);
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
    let testArray = false;

    if (this.addictionArray.length !== 0) {
      testArray = true;
      this.addictionArray.forEach((item, i) => {
        let objAnswersAddiction = [];
        arrayAnswers.forEach((elem, inx) => {
          if (inx !== 0) {
            objAnswersAddiction.push(elem[key+item.id+'_'+inx]);
          }
        });
        objAnswers.push({
          'addiction': item.id,
          'answers': objAnswersAddiction
        });
      });
    } else {
      arrayAnswers.forEach((e, i) => {
        objAnswers.push(e[key+i]);
      });
    }

    if (!this.addiction_id) {
      this.route.snapshot.queryParamMap.get("addiction_id")
    }
    
    let result = {
      'test_id': this.test['id'],
      'answers': objAnswers,
      'addiction_id': this.addiction_id,
      'test_array': testArray
    }
  
    this.testService.storeAnswer(result);
  }

  selectAddiction(event) {
    
    let id = this.test['addictions'][event.source.value].id;
    
    if (event.checked) {
      this.addictionArray.push({
        'id':id,
        'desc': this.test['addictions'][event.source.value].description,
        'order': event.source.value
      })
    } else {
      this.addictionArray.forEach((value,index) => {
        if(value.id==id) this.addictionArray.splice(index,1);
      });
    }

    this.test['questions'].map((question, i)=>{
      if (i != 0) {
        this.test['addictions'].map((addiction) => {
          this.addictionArray.map((addiction2, inx)=> {
            if (addiction2.id == addiction.id) {
              this.formGroup.controls['formArray']['controls'][i]['controls']['answer_'+addiction.id+'_'+i].setValidators([Validators.required]);
            } else {
              this.formGroup.controls['formArray']['controls'][i]['controls']['answer_'+addiction.id+'_'+i].clearValidators();
              this.formGroup.controls['formArray']['controls'][i]['controls']['answer_'+addiction.id+'_'+i].updateValueAndValidity();
            }
          });
        });
      }
    });
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
