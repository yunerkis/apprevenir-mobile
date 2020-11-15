import { Component, OnInit, ViewChild  } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthGuardService } from '../../services/auth-guard.service';
import { IonContent } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  loginForm: FormGroup;
  toggle = 'login';
  @ViewChild(IonContent, { static: false }) content: IonContent;
  
  constructor(
    private formBuilder: FormBuilder,
    private authGuardService: AuthGuardService,
  ) {}

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.email, Validators.required])],
      password: ['', Validators.required],
      remember_me: [''],
    });
  }

  onSubmit() {
    this.authGuardService.login(this.loginForm.value);
  }

  isToggle(stateToogle) {
    this.authGuardService.toggle.next(stateToogle);
    this.authGuardService.toggle.subscribe(state => {
      this.toggle = state;
      this.content.scrollToTop();
    });
  }

}
