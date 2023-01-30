import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { AuthGuardService } from '../../services/auth-guard.service';
import * as dayjs from "dayjs";

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  genderInvalid = false;
  entity = false;
  isEditable = false;
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
  selectsA: any = false;
  selectsB: any = false;
  selectsC: any = false;
  referId = null;
  referPosition = null;
  label = [];
  values = [];

  constructor(
    private formBuilder: FormBuilder,
    private authGuardService: AuthGuardService,
  ) { }

  onProfileNextClicked() {
    const control = this.firstFormGroup.get('gender_id');
    //this.genderInvalid = control.hasError('required');
  }

  ngOnInit() {
    this.firstFormGroup = this.formBuilder.group({
      first_names: ['', Validators.required],
      last_names: ['', Validators.required],
      last_names_two: ['', Validators.required],
      birthday: ['', Validators.required],
      gender_id: [''],
      client_type: ['', Validators.required],
      client: [''],
      selectA: [''],
      selectB: [''],
      selectC: [''],
      civil_status_id: [''],
      education_level_id: [''],
    });
    this.secondFormGroup = this.formBuilder.group({
      country_id: ['', Validators.required],
      state_id: ['', Validators.required],
      city_id: ['', Validators.required],
    });
    this.thirdFormGroup = this.formBuilder.group({
      phone: ['', Validators.required],
      email: ['', Validators.required, Validators.email],
      password: ['', Validators.required],
      password_confirmation: ['', Validators.required],
    }, { validators: sameField, validationPassword });
    this.getCountries();
  }

  getCountries() {
    this.authGuardService.countries().subscribe(
      res => {
        this.countries = res['data'];
      });
  }

  getStates(country) {
    this.getCities('');
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

  getClients(clientType) {
    this.clients = false
    this.selectsA = false;   
    this.selectsB = false;
    this.selectsC = false;
    this.referId = null;
    this.referPosition = null;
    let configClient = [
      'client', 'selectA', 'selectB', 'selectC'
    ]; 
    this.firstFormGroup.patchValue({
      client:'',
      selectA:'',
      selectB:'',
      selectC:''
    });
    if (clientType != 'persona natural') {
      this.authGuardService.getClientsList(clientType).subscribe(res => {
        if (res['data'].length > 0) {
          this.clients = res['data'];
          this.validationSelect(configClient);
        }
      });
    } else {
      this.validationClearSelect(configClient);
    }
  }

  getSelect1(select1) {
    let count = 0;
    this.label = [];
    this.referPosition = select1;
    this.referId = this.clients[select1].id;
    let type = this.clients[select1].client;
    let data = this.clientTypes[type]; 
    
    if (data[0] != 'Entidad Territorial') {
      this.entity = false;
      for (const key in data[1]) {
        if (data[1][key][0] != false) {
          let element = data[1][key][0];
          let name = data[1][key][1];
          this.label.push([key, name]);
          if (count == 0) {
            this.selectsA = this.clients[select1].clientTypeConfig[element];
          } else if (count == 1) {
            this.selectsB = this.clients[select1].clientTypeConfig[element];
          } else if (count == 2) {
            this.selectsC = this.clients[select1].clientTypeConfig[element];
          }
        }
        count++;
      }
    } else {
      this.entity = true;
      this.selectsA = data[1]['Zona'];
    }
  }

  getSelect2(select1) {
    this.selectsB = false;
    this.selectsC = false;
    this.firstFormGroup.patchValue({
      selectB:'',
      selectC:''
    });
    let type = this.firstFormGroup.controls['client_type'].value;
    let selectedClient = this.firstFormGroup.controls['client'].value;
    this.label = this.clientTypes[type][1][select1];
    this.selectsB = this.clients[selectedClient].clientTypeConfig['communes'][select1];
  }

  getSelect3(select2) {
    this.firstFormGroup.patchValue({
      selectC:''
    });
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
    formData.client = formData.client == '' ? 'persona natural' : formData.client;
    formData.client_config = {
      'client_type': formData.client_type,
      'client': this.referId,
      'selectA': formData.selectA,
      'selectB': formData.selectB,
      'selectC': formData.selectC,
      'position':  this.referPosition
    };
    this.authGuardService.register(formData);
  }
}
export function validationPassword(control: AbstractControl
  ): ValidationErrors | null  {
    if(control.get("password").value.length < 8 ){
      control.get("password_confirmation")?.setErrors({ sameError: true });
    }
    return null;
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
    if(control.get("password").value.length < 8 ){
      control.get("password_confirmation")?.setErrors({ length: true });
    }else{
      control.get("password_confirmation")?.setErrors(null);
    }
    return null

  }
  return null;
}

