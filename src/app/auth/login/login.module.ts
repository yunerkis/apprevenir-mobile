import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LoginPageRoutingModule } from './login-routing.module';

import { LoginPage } from './login.page';
import { PasswordResetPageModule } from '../password-reset/password-reset.module';
import { TermsPageModule } from '../terms/terms.module';
import { RegisterPageModule } from '../register/register.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    LoginPageRoutingModule,
    PasswordResetPageModule,
    TermsPageModule,
    RegisterPageModule,
  ],
  declarations: [LoginPage]
})
export class LoginPageModule {}
