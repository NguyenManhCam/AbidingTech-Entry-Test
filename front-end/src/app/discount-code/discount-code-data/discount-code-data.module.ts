import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DiscountCodeDataComponent } from './discount-code-data.component';
import { DiscountCodeDataRoutes } from './discount-code-data.routing';
import { BsDatepickerModule, TimepickerModule } from 'ngx-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    BsDatepickerModule,
    TimepickerModule,
    DiscountCodeDataRoutes
  ],
  declarations: [DiscountCodeDataComponent]
})
export class DiscountCodeDataModule { }
