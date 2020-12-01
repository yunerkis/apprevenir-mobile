import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthService } from './services/auth.service';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./auth/template/template.module').then( m => m.TemplatePageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./views/tabs/tabs.module').then(m => m.TabsPageModule),
    canActivate: [AuthService]
  },
  {
    path: 'modal',
    loadChildren: () => import('./views/modals/modal/modal.module').then( m => m.ModalPageModule)
  },
  {
    path: 'test',
    loadChildren: () => import('./views/test/template/template.module').then(m => m.TemplatePageModule),
    canActivate: [AuthService]
  },
  {
    path: 'result',
    loadChildren: () => import('./views/modals/result/result.module').then( m => m.ResultPageModule)
  },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
