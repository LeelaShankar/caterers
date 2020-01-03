import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReviewCartPage } from './review-cart.page';

const routes: Routes = [
  {
    path: '',
    component: ReviewCartPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReviewCartPageRoutingModule {}
