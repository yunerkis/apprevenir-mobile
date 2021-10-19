import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl, ValidationErrors } from '@angular/forms';
import { AuthGuardService } from '../../services/auth-guard.service';
import { Storage } from '@ionic/storage';
import {MatStepper} from '@angular/material/stepper/index';
import { IonContent } from '@ionic/angular';
import { Router } from '@angular/router';
import { TestService } from '../../services/test.service';
import { ModalController } from '@ionic/angular';
import { ResultPage } from '../modals/result/result.page';
import * as dayjs from "dayjs";
import { promise } from 'selenium-webdriver';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit, AfterViewInit {

  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  entity = false;
  tab = "data";
  image_gender = '';
  name = '';
  lastNames = '';
  isEditable = false;
  genderInvalid = false;
  countries = [];
  states = [];
  cities = [];
  clients:any = false;
  clientTypes = {
    'persona natural' : ['Ninguno'],
    'entidades territoriales' : [
      'Entidad Territorial',
      {
        'Zona': ['rural', 'urbana'],
        'rural': ['corregimiento', 'vereda'],
        'urbana': ['comuna', 'barrio']
      }
    ],
    'secretarias de educacion': [
      'Secretaría de Educación',
      {
        'Institución educativa': ['educationalInstitutions', 'educational_institution'],
        'Grado': ['grades', 'grade']
      }

    ],
    'instituciones educativas': [
      'Institución Educativa',
      {
        'Grado': ['educationalGrades', 'grade']
      }
    ],
    'universidades': [
      'Universidad',
      {
        'Programa': ['programs', 'program'],
        'Modalidad': ['modalities', 'modality'],
        'Semestre': ['semesters', 'semester']
      }
    ],
    'empresas': [
      'Empresa',
      {
        'Sede': ['locations', 'location'],
        'Área': ['areas', 'area'],
        'Turno': ['schedules', 'schedul']
      }
    ]
  };
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
  selectsA: any = false;
  selectsB: any = false;
  selectsC: any = false;
  referId = null;
  type = null;
  position = null;
  label = [];
  values = [];

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

  onProfileNextClicked() {
    const control = this.firstFormGroup.get('gender_id');
    this.genderInvalid = control.hasError('required');
  }

  ngOnInit() {
    this.router.events.subscribe((evt) => {
      this.content.scrollToTop();
    });
    this.firstFormGroup = this.formBuilder.group({
      first_names: ['', Validators.required],
      last_names: ['', Validators.required],
      last_names_two: ['', Validators.required],
      birthday: ['', Validators.required],
      gender_id: ['', Validators.required],
      client_type: ['', Validators.required],
      client: [''],
      selectA: [''],
      selectB: [''],
      selectC: [''],
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
      password: [''],
      password_confirmation: [''],
    }, { validators: sameField });

    this.testService.myResults().then( res => { 
      res.subscribe(results => { this.dataSource = results['data']});
    });
  }

  ngAfterViewInit() {
    this.storage.get('PROFILE').then(profile => {
      let config = JSON.parse(profile.client_config);
      this.image_gender = profile.gender_id;
      this.name = profile.first_names;
      this.lastNames = profile.last_names + ' ' + profile.last_names_two;
      
      this.firstFormGroup.patchValue({
        first_names: profile.first_names,
        last_names: profile.last_names,
        last_names_two: profile.last_names_two,
        birthday: profile.birthday,
        gender_id: profile.gender_id,
        civil_status_id: profile.civil_status_id,
        education_level_id: profile.education_level_id,
        client_type: config['client_type'],
        client: parseInt(config['client']),
        selectA: parseInt(config['selectA']),
        selectB: parseInt(config['selectB']),
        selectC: parseInt(config['selectC']),
      });
      this.secondFormGroup.patchValue({
        country_id: profile.country_id,
        state_id: profile.state_id,
        city_id:profile.city_id,
      });
      this.thirdFormGroup.patchValue({
        phone: profile.phone,
        email: profile.email,
      });

      this.getCountries();
      this.getStates(profile.country_id);
      this.getCities(profile.state_id);
      
      this.getClients(config['client_type'], false, config['client'])
    });
  }
  
  getCountries() {
    this.authGuardService.countries().subscribe(res => {this.countries = res['data'];});
  }

  getStates(country) {
    if (country != '') {
      this.authGuardService.states(country).subscribe(
        res => {
         this.states = res['data'];
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
        });
    } else {
      this.cities = [];
    }
  }

  getClients(clientType, update = true, clientId) {
    this.clients = false
    this.selectsA = false;   
    this.selectsB = false;
    this.selectsC = false;
    this.referId = null;
    let configClient = [
      'client', 'selectA', 'selectB', 'selectC'
    ]; 
    if (update) {
      this.firstFormGroup.patchValue({
        client:'',
        selectA:'',
        selectB:'',
        selectC:''
      });
    }
    if (clientType != 'persona natural') {
      this.authGuardService.getClientsList(clientType).subscribe(res => {
        if (res['data'].length > 0) {
          this.clients = res['data'];
          this.validationSelect(configClient);
          if (!update && clientType != 'persona natural') {
            this.getSelect1(clientId, update);
          }
        }
      });
    } else {
      this.validationClearSelect(configClient);
    }
  }

  getSelect1(select1, update = true) {
    let count = 0;
    this.label = [];
    this.clients.forEach((e, i) => {
      if (e.id == select1) {
        this.referId = e.id;
        this.type = e.client;
        this.position = i;
      }
    });
  
    let data = this.clientTypes[this.type]; 
    
    if (data[0] != 'Entidad Territorial') {
      this.entity = false;
      for (const key in data[1]) {
        if (data[1][key][0] != false) {
          let element = data[1][key][0];
          let name = data[1][key][1];
          this.label.push([key, name]);
          if (count == 0) {
            this.selectsA = this.clients[this.position].clientTypeConfig[element];
          } else if (count == 1) {
            this.selectsB = this.clients[this.position].clientTypeConfig[element];
          } else if (count == 2) {
            this.selectsC = this.clients[this.position].clientTypeConfig[element];
          }
        }
        count++;
      }
    } else {
      this.entity = true;
      this.selectsA = data[1]['Zona'];
      if (!update) {
        this.getSelect2(this.firstFormGroup.controls['selectA'].value, update);
      }
    }
  }

  getSelect2(select1, update = true) {
    this.selectsB = false;
    this.selectsC = false;
    if (update) {
      this.firstFormGroup.patchValue({
        selectB:'',
        selectC:''
      });
    }

    let type = this.firstFormGroup.controls['client_type'].value;
    let selectedClient = this.firstFormGroup.controls['client'].value;
    this.label = this.clientTypes[type][1][select1];
    this.selectsB = this.clients[selectedClient].clientTypeConfig['communes'][select1];
    
    if (!update) {
      this.getSelect3(this.firstFormGroup.controls['selectB'].value, update);
    }
  }

  getSelect3(select2, update = true) {
    if (update) {
      this.firstFormGroup.patchValue({
        selectC:''
      });
    }
    this.selectsB.forEach(e => {
        if (e.id == select2) {
          this.selectsC = e['neighborhoods']
        }
    });
  }

  validationSelect(config) {
    config.forEach(e => {
      this.firstFormGroup.controls[e].setValidators([Validators.required]);
    });
  }

  validationClearSelect(config) {
    config.forEach(e => {
      this.firstFormGroup.controls[e].patchValue('');
      this.firstFormGroup.controls[e].clearValidators();
      this.firstFormGroup.controls[e].updateValueAndValidity();
    });
  }

  onSubmit() {
    if(this.firstFormGroup.invalid || this.secondFormGroup.invalid || this.thirdFormGroup.invalid) {
      return;
    }
    let formData = Object.assign(this.firstFormGroup.value, this.secondFormGroup.value, this.thirdFormGroup.value); 
    formData.birthday = dayjs(formData.birthday).format("YYYY-MM-DD");
    formData.reference = this.referId;
    formData.client = formData.client == '' ||  this.referId ? 'persona natural' : formData.client_type;
    formData.client_config = {
      'client_type': formData.client_type,
      'client': this.referId,
      'selectA': formData.selectA,
      'selectB': formData.selectB,
      'selectC': formData.selectC,
    };
    this.authGuardService.updateProfile(formData).then((data) => {
      this.image_gender = formData.gender_id;
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

export function sameField(
  control: AbstractControl
): ValidationErrors | null {
  if (control && control.get("password") && control.get("password_confirmation")) {
    const password = control.get("password").value;
    const passwordConfirmation = control.get("password_confirmation").value;  
    if (password != passwordConfirmation) {
      control.get("password_confirmation")?.setErrors({ sameError: true });
    } else {
      control.get("password_confirmation")?.setErrors(null);
    }
    return null
  }
  return null;
}
