import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginPage } from '../login/login.page';
import { PasswordResetPage } from '../password-reset/password-reset.page';
import { RegisterPage } from '../register/register.page';

import { TemplatePage } from './template.page';

const routes: Routes = [
  {
    path: '',
    component: TemplatePage,
    children: [
        { path: 'login', component: LoginPage},
        { path: 'password-reset', component: PasswordResetPage},
        { path: 'register', component: RegisterPage},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TemplatePageRoutingModule {}
