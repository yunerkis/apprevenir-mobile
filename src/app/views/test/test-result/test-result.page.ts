import { Component, OnInit } from '@angular/core';
import { TestService } from '../../../services/test.service';
import { Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { LoaderService } from '../../../services/loader.service';
import { ModalController } from '@ionic/angular';
import { LevelPage } from '../../modals/level/level.page';


@Component({
  selector: 'app-test-result',
  templateUrl: './test-result.page.html',
  styleUrls: ['./test-result.page.scss'],
})
export class TestResultPage implements OnInit {

  testResults = [];
  load = false;
  tab = "result";
  gifLevel = {
    'Leve': '<img src="../../../assets/images/leve.gif" alt="leve">',
    'Ausencia de Ansiedad': '<img src="../../../assets/images/leve.gif" alt="leve">',
    'Ausencia de depresión': '<img src="../../../assets/images/leve.gif" alt="leve">',
    'Moderado': '<img src="../../../assets/images/moderado.gif" alt="moderado">',
    'Severo': '<img src="../../../assets/images/severo.gif" alt="severo">',
    'Presencia de Ansiedad': '<img src="../../../assets/images/severo.gif" alt="severo">',
    'Presencia de depresión': '<img src="../../../assets/images/severo.gif" alt="severo">',
  };
  colorsLevel = {
    'Leve': 'color: #20E57E',
    'Ausencia de Ansiedad': 'color: #20E57E',
    'Ausencia de depresión': 'color: #20E57E',
    'Moderado': 'color: #FFA14E',
    'Severo': 'color: #FF4E60',
    'Presencia de Ansiedad': 'color: #FF4E60',
    'Presencia de depresión': 'color: #FF4E60',
  };


  constructor(
    public testService: TestService,
    private router: Router,
    private _sanitizer: DomSanitizer,
    public loaderService: LoaderService,
    public modalController: ModalController, 
  ) { }

  ngOnInit() {
    this.loaderService.showHideAutoLoader();
    
    this.testService.testInfo.subscribe((val) => {
      if (val.length == 0) {
        this.router.navigate(['home']);
      }

      val.map((result) => {
        console.log(result)
        this.testResults.push({
          'resultLevel': result['resultLevel'],
          'url_video': result['url_video'],
          'professional_help': result['professional_help'],
          'url_interest': result['url_interest'],
          'addiction': result['addiction']
        });
      });
    }, data => {
      if (data.error.data == 'disabled') {
        this.testService.userDelete()
      }
    });

    setTimeout(()=>{
      this.loadResult(); 
    }, 2700);
  }

  toggletab(toggle) {
    this.tab = toggle;
  }

  loadResult() {
    this.load = true;
  }

  getVideoIframe(url) {
      var video, results;
  
      if (url === null) {
          return '';
      }
      results = url.match('[\\?&]v=([^&#]*)');
      video   = (results === null) ? url : results[1];
  
      return this._sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/' + video);   
  }

  async openModal(level) {
    const modal = await this.modalController.create({
      component: LevelPage,
      cssClass: 'modal-terms',
      componentProps: {
        "level": level,
        "gifLevel": this.gifLevel[level],
        "colorsLevel": this.colorsLevel[level]
      }
    });

    return await modal.present();
  }
}
