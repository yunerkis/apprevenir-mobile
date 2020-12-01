import { Component, OnInit } from '@angular/core';
import { TestService } from '../../../services/test.service';
import { Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';


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
  tab = "result";

  constructor(
    public testService: TestService,
    private router: Router,
    private _sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    this.testService.testInfo.subscribe( (val) => {
      if (Object.keys(val).length == 0) {
        this.router.navigate(['home']);
      }
      this.resultLevel = val['resultLevel'];
      this.url_video = val['url_video'];
      this.professional_help = val['professional_help'];
      this.url_interest = val['url_interest'];
    });
  }

  toggletab(toggle) {
    this.tab = toggle;
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
