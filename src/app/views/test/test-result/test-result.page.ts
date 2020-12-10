import { Component, OnInit } from '@angular/core';
import { TestService } from '../../../services/test.service';
import { Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { LoaderService } from '../../../services/loader.service';


@Component({
  selector: 'app-test-result',
  templateUrl: './test-result.page.html',
  styleUrls: ['./test-result.page.scss'],
})
export class TestResultPage implements OnInit {

  resultLevel = "";
  url_video = "";
  professional_help = "";
  url_interest = "";
  load = false;
  tab = "result";
  gifLevel = {
    'Leve': '<img src="../../../assets/images/leve.gif" alt="leve">',
    'Moderado': '<img src="../../../assets/images/moderado.gif" alt="moderado">',
    'Severo': '<img src="../../../assets/images/severo.gif" alt="severo">',
  };
  colorsLevel = {
    'Leve': 'color: #20E57E',
    'Moderado': 'color: #FFA14E',
    'Severo': 'color: #FF4E60',
  };


  constructor(
    public testService: TestService,
    private router: Router,
    private _sanitizer: DomSanitizer,
    public loaderService: LoaderService 
  ) { }

  ngOnInit() {
    this.loaderService.showHideAutoLoader();
    
    this.testService.testInfo.subscribe( (val) => {
      if (Object.keys(val).length == 0) {
        this.router.navigate(['home']);
      }
      this.resultLevel = val['resultLevel'];
      this.url_video = val['url_video'];
      this.professional_help = val['professional_help'];
      this.url_interest = val['url_interest'];
    }, data => {
      if (data.error.data == 'disabled') {
        this.testService.userDelete()
      }
      console.log(data.error);
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

}
