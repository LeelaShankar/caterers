import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReviewCartPageRoutingModule } from './review-cart-routing.module';

import { ReviewCartPage } from './review-cart.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReviewCartPageRoutingModule
  ],
  declarations: [ReviewCartPage]
})
export class ReviewCartPageModule {}
