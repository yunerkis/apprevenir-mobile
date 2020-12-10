import { Component, OnInit  } from '@angular/core';
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
  show = false;
  
  constructor(
    private formBuilder: FormBuilder,
    private authGuardService: AuthGuardService,
  ) {}

  // email = new FormControl('', [Validators.required, Validators.email]);

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.email, Validators.required])],
      password: ['', Validators.required],
      remember_me: [''],
    });
  }

  password() {
    this.show = !this.show;
  }

  onSubmit() {
    if(this.loginForm.invalid) {
      this.loginForm.setErrors({ ...this.loginForm.errors, 'yourErrorName': true });
      return;
    }
    this.authGuardService.login(this.loginForm.value);
  }
}
