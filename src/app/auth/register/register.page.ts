import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
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
  clients:any = false;
  clientTypes = {
    'persona natual' : ['Ninguno'],
    'entidades territoriales' : [
      'Entidad Territorial',
      {
        'Zona': ['zones', 'zone'],
        'Comuna': ['communes', 'commune'],
        'Barrio': ['neighborhoods', 'neighborhood']
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
        'Modalidad': ['modalities', 'modality	'],
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
  selects1: any = false;
  selects2: any = false;
  selects3: any = false;
  referId = null;
  label = [];
  values = [];

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
      password: ['', Validators.required],
      password_confirmation: ['', Validators.required],
    });
    this.getCountries();
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
    this.getCities('');
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

  getClients(clientType) {
    if (clientType != 'persona natual') {
      this.authGuardService.getClientsList(clientType).subscribe(res => {
        this.clients = false;
        this.selects1 = false;   
        this.selects2 = false;
        this.selects3 = false;
        this.firstFormGroup.patchValue({
          client: '',
          selectA: '',
          selectB: '',
          selectC: ''
        });
        if (res['data'].length > 0) {
          this.clients = res['data'];
        }
      });
    }
  }

  getSelect1(select1) {
    this.label = [];
    this.values = [];  
    this.selects1 = false;   
    this.selects2 = false;
    this.selects3 = false;
    this.referId = null;
    this.firstFormGroup.patchValue({
      selectA: '',
      selectB: '',
      selectC: ''
    });
    
    let type = this.clients[select1].client;
    this.referId = this.clients[select1].id;
    let data = this.clientTypes[type]; 
    for (const key in data[1]) {
      this.label.push(key);
      this.values.push(data[1][key]);
    }

    this.selects1 = this.clients[select1][this.values[0][0]];
  }

  getSelect2(select2) {
    this.selects2 = false;
    this.selects3 = false;
    this.firstFormGroup.patchValue({
      selectB: '',
      selectC: ''
    });
    this.selects2 = this.selects1[select2][this.values[1][0]];
  }

  getSelect3(select3) {
    this.selects3 = false;
    this.firstFormGroup.patchValue({
      selectC: ''
    });
    this.selects3 = this.selects2[select3][this.values[2][0]];
  }

  onSubmit() {
    let formData = Object.assign(this.firstFormGroup.value, this.secondFormGroup.value, this.thirdFormGroup.value); 
    formData.last_names = formData.last_name_one+' '+formData.first_name_two;
    formData.reference = this.referId;
    formData.client = formData.client == '' ? 'persona natual' : formData.client;
    formData.client_config = {
      'client_type': formData.client_type,
      'client': formData.client,
      'selectA': formData.selectA,
      'selectB': formData.selectB,
      'selectC': formData.selectC,
    };
    this.authGuardService.register(formData);
  }
}
