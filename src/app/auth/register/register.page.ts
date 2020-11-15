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
  thirdFormGroup: FormGroup;
  isEditable = false;
  countries = [];
  states = [];
  cities = [];

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
      country_id: ['', Validators.required],
      state_id: ['', Validators.required],
      city_id: ['', Validators.required],
    });
    this.thirdFormGroup = this.formBuilder.group({
      phone: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
      password_confirmation: ['', Validators.required],
    });
    this.getCountries();
  }

  cancel() {
    this.authGuardService.toggle.next('login');
  }

  getCountries() {
    this.authGuardService.countries().subscribe(
      res => {
        this.countries = res['data'];
      }, data => {
        console.log(data.error.errors);
      });
  }

  getStates(country) {
    if (country != '') {
      this.authGuardService.states(country).subscribe(
        res => {
         this.states = res['data'];
        }, data => {
          console.log(data.error.errors);
        });
    } else {
      this.states = [];
      this.getCities([]);
    }
  }

  getCities(state) {
    if (state != '') {
      this.authGuardService.cities(state).subscribe(
        res => {
         this.cities = res['data'];
        }, data => {
          console.log(data.error.errors);
        });
    } else {
      this.cities = [];
    }
  }

  onSubmit() {
    let formData = Object.assign(this.firstFormGroup.value, this.secondFormGroup.value, this.thirdFormGroup.value); 
    formData.last_names = formData.last_name_one+' '+formData.first_name_two;
    this.authGuardService.register(formData);
  }
}
