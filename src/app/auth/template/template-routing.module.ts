import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TemplatePage } from './template.page';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: '',
    component: TemplatePage,
    children: [
      {
        path: 'login',
        loadChildren: () => import('../login/login.module').then(m => m.LoginPageModule)
      },
      {
        path: 'password-reset',
        loadChildren: () => import('../password-reset/password-reset.module').then(m => m.PasswordResetPageModule)
      },
      {
        path: 'register',
        loadChildren: () => import('../register/register.module').then(m => m.RegisterPageModule)
      },
      {
        path: 'modal',
        loadChildren: () => import('../modal/modal.module').then( m => m.ModalPageModule)
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TemplatePageRoutingModule {}
