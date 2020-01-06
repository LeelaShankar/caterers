import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MyordersPageRoutingModule } from './myorders-routing.module';

import { MyordersPage } from './myorders.page';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HttpClientModule,
    MyordersPageRoutingModule
  ],
  declarations: [MyordersPage]
})
export class MyordersPageModule { }
