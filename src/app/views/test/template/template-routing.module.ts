import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TemplatePage } from './template.page';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/test/test/:id',
    pathMatch: 'full'
  },
  {
    path: '',
    component: TemplatePage,
    children : [
      {
        path: 'test/:id',
        loadChildren: () => import('../test/test.module').then( m => m.TestPageModule),
      },
      {
        path: 'test-result',
        loadChildren: () => import('../test-result/test-result.module').then( m => m.TestResultPageModule)
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TemplatePageRoutingModule {}
