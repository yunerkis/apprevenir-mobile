import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { TestService } from '../../../services/test.service';
import { ActivatedRoute } from "@angular/router";
import { FormGroup, FormBuilder, FormControl, Validators, AbstractControl, FormArray  } from '@angular/forms';

@Component({
  selector: 'app-test',
  templateUrl: './test.page.html',
  styleUrls: ['./test.page.scss'],
})
export class TestPage implements OnInit {

  test = [];
  formGroup: FormGroup;
  answers = [];
  answer = {};
  get formArray(): AbstractControl | null { return this.formGroup.get('formArray'); }

  @Output() dataTest: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    public testService: TestService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit() {

    this.formGroup = this.formBuilder.group({formArray: this.formBuilder.array([])});

    const id = this.route.snapshot.paramMap.get("id");

    this.testService.getTest(id).then( res => { 
      res.subscribe(test => {
        this.test = test['data'];
        this.dataTest.emit(this.test);
        this.test['questions'].forEach(question => {
          this.answer = {};
          this.answer['answer_id_'+question.id] = ['', Validators.required];
          this.answers.push(this.formBuilder.group(this.answer));
        });
        this.formGroup = this.formBuilder.group({ formArray: this.formBuilder.array(this.answers) });
      });
    });
  }

  onSubmit() {
    console.log(this.formGroup.value)
  }
}
