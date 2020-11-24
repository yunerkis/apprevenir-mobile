import { Component, OnInit, ViewChild } from '@angular/core';
import { IonContent } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-template',
  templateUrl: './template.page.html',
  styleUrls: ['./template.page.scss'],
})
export class TemplatePage implements OnInit {

  @ViewChild(IonContent, { static: false }) content: IonContent;

  constructor(private router: Router) { }

  ngOnInit() {
   
    this.router.events.subscribe((evt) => {
      this.content.scrollToTop();
    });
  }

}
