import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { TestService } from '../../services/test.service';
import { ModalPage } from '../modals/modal/modal.page';
import { Router, NavigationEnd } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { LoaderService } from '../../services/loader.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {

  tests = [];
  arryTests = [];
  search = false;
  images : any = {};
  SearchForm: FormGroup;
  url = environment.url+'/storage';

  constructor(
    public modalController: ModalController,
    public testService: TestService,
    private router: Router,
    private formBuilder: FormBuilder,
    public sanitizer: DomSanitizer,
    public loaderService: LoaderService 
  ) {
    this.router.events.subscribe(event => {       
      if (event instanceof NavigationEnd && event.url == '/home') {
        this.testService.test.next([])
      }
    });
  }

  ngOnInit() {

    this.loaderService.showHideAutoLoader();

    this.testService.getTestsList().then( res => { 
      res.subscribe(tests => { 
        this.tests = tests['data']; 
        this.arryTests = tests['data'];
      }, data => {
        if (data.error.data == 'disabled') {
          this.testService.userDelete()
        }
        console.log(data.error);
      });
    });

    this.SearchForm = this.formBuilder.group({
      search: [''],
    }); 
  }

  async openModal(contents, type) {
    const modal = await this.modalController.create({
      component: ModalPage,
      cssClass: 'modal-terms',
      componentProps: {
        "contents": contents,
        "type": type
      }
    });

    return await modal.present();
  }

  toggleSearch() {
    this.search = !this.search;
    this.tests = this.arryTests;
  }

  arrayFilter() {
    let search = this.SearchForm.value.search.toLowerCase();
    this.tests = this.arryTests;
    this.tests = this.tests.filter(function(test) {
      if (test.name.toLowerCase().indexOf(search) !== -1) {
        return test;
      }
    });
  }
}
