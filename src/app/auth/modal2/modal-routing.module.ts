import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Modal2Page } from './modal.page';

const routes: Routes = [
  {
    path: '',
    component: Modal2Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalPageRoutingModule {}
