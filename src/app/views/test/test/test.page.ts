import { Component, OnInit } from '@angular/core';
import { TestService } from '../../../services/test.service';
import { ActivatedRoute } from "@angular/router";
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-test',
  templateUrl: './test.page.html',
  styleUrls: ['./test.page.scss'],
})
export class TestPage implements OnInit {

  test = [];
  formGroup: FormGroup;

  constructor(
    public testService: TestService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit() {

    this.formGroup = this.formBuilder.group({});

    const id = this.route.snapshot.paramMap.get("id");

    this.testService.getTest(id).then( res => { 
      res.subscribe(test => {
        this.test = test['data'];
        this.test['questions'].forEach(question => {
          let id = question.id;
          this.formGroup.addControl('answer_id_'+id, new FormControl('', Validators.required));
        });
      });
    });
  }

  onSubmit() {
    console.log('test')
  }

}
