import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthGuardService } from '../../services/auth-guard.service';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.page.html',
  styleUrls: ['./password-reset.page.scss'],
})
export class PasswordResetPage implements OnInit {

  resetForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authGuardService: AuthGuardService,
  ) { }

  ngOnInit() {
    this.resetForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.email, Validators.required])],
    });
  }

  onSubmit() {
    if(this.resetForm.invalid) {
      this.resetForm.setErrors({ ...this.resetForm.errors, 'yourErrorName': true });
      return;
    }
    this.authGuardService.reset(this.resetForm.value);
  }

}
