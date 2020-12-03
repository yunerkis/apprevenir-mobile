import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AuthGuardService } from '../../services/auth-guard.service';
import { Storage } from '@ionic/storage';
import {MatStepper} from '@angular/material/stepper/index';
import { IonContent } from '@ionic/angular';
import { Router } from '@angular/router';
import { TestService } from '../../services/test.service';
import { ModalController } from '@ionic/angular';
import { ResultPage } from '../modals/result/result.page';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit {

  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  isEditable = false;
  countries = [];
  states = [];
  cities = [];
  tab = "data";
  profile: any = '';
  genders = [
    {
      gender : 'Femenino',
      value: 1
    },
    {
      gender : 'Masculino',
      value: 2
    },
  ];
  civil_statuses = [
    {
      status : 'Soltero/a',
      value: 1
    },
    {
      status : 'Casado/a',
      value: 2
    },
    {
      status : 'Viudo/a',
      value: 3
    },
    {
      status : 'Divorciado/a',
      value: 4
    },
  ];
  educations = [
    {
      education : 'Primaria',
      value: 1
    },
    {
      education : 'Bachiller',
      value: 2
    },
    {
      education : 'Universitario',
      value: 3
    },
    {
      education : 'Posgrado',
      value: 4
    },
    {
      education : 'Ninguno',
      value: 5
    },
  ];
  displayedColumns: string[] = ['Test', 'Fecha', 'Nivel', 'Respuestas'];
  dataSource = [];
  color = {
    'Severo': '#FF4E60',
    'Moderado': '#FFA14E',
    'Leve': '#20E57E'
  };

  @ViewChild('stepper') stepper: MatStepper;

  @ViewChild(IonContent, { static: false }) content: IonContent;

  constructor(
    private formBuilder: FormBuilder,
    private authGuardService: AuthGuardService,
    private storage: Storage,
    public testService: TestService,
    private router: Router,
    public modalController: ModalController,
  ) {}

  ngOnInit() {

    this.router.events.subscribe((evt) => {
      this.content.scrollToTop();
    });

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
      email: [''],
      password: ['', Validators.required],
      password_confirmation: ['', Validators.required],
    });

    this.storage.get('PROFILE').then(profile => {
      this.profile = profile;
      this.profile.last_name_one = this.profile.last_names.split(" ")[0];
      this.profile.first_name_two = this.profile.last_names.split(" ")[1];

      this.firstFormGroup = this.formBuilder.group({
        first_names: [this.profile.first_names, Validators.required],
        last_name_one: [this.profile.last_name_one, Validators.required],
        first_name_two: [this.profile.first_name_two, Validators.required],
        birthday: [this.profile.birthday, Validators.required],
        gender_id: [this.profile.gender_id, Validators.required],
        civil_status_id: [this.profile.civil_status_id, Validators.required],
        education_level_id: [this.profile.education_level_id, Validators.required],
      });

      this.secondFormGroup = this.formBuilder.group({
        country_id: [this.profile.country_id, Validators.required],
        state_id: [this.profile.state_id, Validators.required],
        city_id: [this.profile.city_id, Validators.required],
      });

      this.thirdFormGroup = this.formBuilder.group({
        phone: [this.profile.phone, Validators.required],
        email: [this.profile.email],
        password: [''],
        password_confirmation: [''],
      });

      this.getCountries();

      this.getStates(this.profile.country_id);

      this.getCities(this.profile.state_id);
    });

    this.testService.myResults().then( res => { 
      res.subscribe(results => { this.dataSource = results['data']}, data => {
        if (data.error.data == 'disabled') {
          this.testService.userDelete()
        }
        console.log(data.error);
      });
    });
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
      this.getCities('');
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
    this.authGuardService.updateProfile(formData).then(() => {
      this.router.navigate(['home/tab2']);
      this.stepper.selectedIndex = 0;
    });
  }

  toggletab(toggle) {
    this.tab = toggle;
  }

  setStyle(color) {
    return {
      'background-color': this.color[color],
      'color': '#fff',
      'padding-left': '15px',
      'padding-right': '15px',
      'border-radius': '10px',
      'padding-top': '1px',
      'padding-bottom': '1px',
    }
  }

  async openModal(contents) {
    const modal = await this.modalController.create({
      component: ResultPage,
      cssClass: 'modal-terms',
      componentProps: {
        "contents": contents,
      }
    });

    return await modal.present();
  }
}
