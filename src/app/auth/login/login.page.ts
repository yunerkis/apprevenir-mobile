import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AuthGuardService } from '../../services/auth-guard.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  loginForm: FormGroup;
  toggle = 'login';
  
  constructor(
    private formBuilder: FormBuilder,
    private authGuardService: AuthGuardService,
  ) {}

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.email, Validators.required])],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    this.authGuardService.login(this.loginForm.value);
  }

  isToggle(stateToogle) {
    this.authGuardService.toogle.next(stateToogle);
    this.authGuardService.toogle.subscribe(state => {
      this.toggle = state;
    });
  }

}
