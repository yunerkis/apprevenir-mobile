import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthService } from './services/auth.service';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: '',
    loadChildren: () => import('./auth/template/template.module').then( m => m.TemplatePageModule)
  },
  // {
  //   path: 'home',
  //   loadChildren: () => import('./views/tabs/tabs.module').then(m => m.TabsPageModule),
  // },
  
  // {
  //   path: 'login',
  //   loadChildren: () => import('./auth/login/login.module').then( m => m.LoginPageModule)
  // },
  {
    path: 'test',
    loadChildren: () => import('./views/test/test.module').then( m => m.TestPageModule),
    canActivate: [AuthService]
  },
  // {
  //   path: 'terms',
  //   loadChildren: () => import('./auth/terms/terms.module').then( m => m.TermsPageModule)
  // },
  {
    path: 'modal',
    loadChildren: () => import('./auth/modal/modal.module').then( m => m.ModalPageModule)
  },
  // {
  //   path: 'register',
  //   loadChildren: () => import('./auth/register/register.module').then( m => m.RegisterPageModule)
  // },
  // {
  //   path: 'password-reset',
  //   loadChildren: () => import('./auth/password-reset/password-reset.module').then( m => m.PasswordResetPageModule)
  // }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
