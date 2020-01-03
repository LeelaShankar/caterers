import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PackagePageRoutingModule } from './package-routing.module';

import { PackagePage } from './package.page';
import { HttpClientModule } from '@angular/common/http';
import { HomePage } from '../home/home.page';
import { ReviewCartPage } from '../review-cart/review-cart.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    HttpClientModule,
    PackagePageRoutingModule
  ],
  declarations: [PackagePage, HomePage, ReviewCartPage],
  entryComponents: [HomePage, ReviewCartPage]
})
export class PackagePageModule { }
