import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TemplatePageRoutingModule } from './template-routing.module';

import { TemplatePage } from './template.page';

import { LoginPage } from '../login/login.page';
import { PasswordResetPage } from '../password-reset/password-reset.page';
import { TermsPageModule } from '../terms/terms.module';
import { RegisterPageModule } from '../register/register.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    TemplatePageRoutingModule,
    TermsPageModule,
    RegisterPageModule
  ],
  declarations: [TemplatePage, LoginPage, PasswordResetPage]
})
export class TemplatePageModule {}
