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
  image_gender = '';
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
  clients:any = false;
  clientTypes = {
    'persona natual' : ['Persona Natural'],
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
  selects1: any = false;
  selects2: any = false;
  selects3: any = false;
  referId = null;
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
      client_type: ['', Validators.required],
      client: [''],
      selectA: [''],
      selectB: [''],
      selectC: [''],
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
      let config = JSON.parse(this.profile.client_config);
      
      this.image_gender = this.profile.gender_id;
     
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
        client_type: [config['client_type'], Validators.required],
        client: [config['client']],
        selectA: [config['selectA']],
        selectB: [config['selectB']],
        selectC: [config['selectC']],
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

      this.getClients(config['client_type'], 1)

      setTimeout(() => {
        this.getSelect1(config['selectA'], 1)
        this.getSelect2(config['selectB'], 1)
        this.getSelect3(config['selectC'], 1)
      }, 1000);
      
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

  getClients(clientType, reset = null) {
    if (clientType != 'persona natual') {
      this.authGuardService.getClientsList(clientType).subscribe(res => {
        this.clients = false;
        this.selects1 = false;   
        this.selects2 = false;
        this.selects3 = false;
        if (reset == null) {
          this.firstFormGroup.patchValue({
            client: '',
            selectA: '',
            selectB: '',
            selectC: ''
          });
        }
        if (res['data'].length > 0) {
          this.clients = res['data'];
        }
      });
    }
  }

  getSelect1(select1, reset = null)
  {
    this.label = [];
    this.values = [];
    this.selects1 = false;
    this.selects2 = false;
    this.selects3 = false;
    this.referId = null;

    if (reset == null) {
      this.firstFormGroup.patchValue({
        selectA: '',
        selectB: '',
        selectC: ''
      });
    }

    let type = this.clients[select1].client;
    this.referId = this.clients[select1].id;
    let data = this.clientTypes[type]; 
    for (const key in data[1]) {
      this.label.push(key);
      this.values.push(data[1][key]);
    }
    
    this.selects1 = this.clients[select1][this.values[0][0]];
  }

  getSelect2(select2, reset = null)
  {
    this.selects2 = false;
    this.selects3 = false;
    if (reset == null) {
      this.firstFormGroup.patchValue({
        selectB: '',
        selectC: ''
      });
    }
    this.selects2 = this.selects1[select2][this.values[1][0]];
  }

  getSelect3(select3, reset = null)
  {
    this.selects3 = false;
    if (reset == null) {
      this.firstFormGroup.patchValue({
        selectC: ''
      });
    }
    this.selects3 = this.selects2[select3][this.values[2][0]];
  }

  onSubmit() {
    let formData = Object.assign(this.firstFormGroup.value, this.secondFormGroup.value, this.thirdFormGroup.value); 
    formData.last_names = formData.last_name_one+' '+formData.first_name_two;
    formData.reference = this.referId;
    formData.client_config = {
      'client_type': formData.client_type,
      'client': formData.client,
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
