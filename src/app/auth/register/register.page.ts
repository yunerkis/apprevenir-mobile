import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AuthGuardService } from '../../services/auth-guard.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  isEditable = false;

  constructor(
    private formBuilder: FormBuilder,
    private authGuardService: AuthGuardService,
  ) { }

  ngOnInit() {
    this.firstFormGroup = this.formBuilder.group({
      first_names: ['', Validators.required],
      last_name_one: ['', Validators.required],
      first_name_two: ['', Validators.required],
      birthday: ['', Validators.required],
      gender_id: ['', Validators.required],
      civil_status_id: ['', Validators.required],
      education_level_id: ['', Validators.required],
    });
    this.secondFormGroup = this.formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
  }

}
