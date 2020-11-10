import { Component, OnInit } from '@angular/core';
import { AuthGuardService } from '../../services/auth-guard.service';

@Component({
  selector: 'app-test',
  templateUrl: './test.page.html',
  styleUrls: ['./test.page.scss'],
})
export class TestPage implements OnInit {

  constructor(
    private authGuardService: AuthGuardService
  ) { }

  ngOnInit() {
  }

  logoutUser(){
    this.authGuardService.logout();
  }

}
