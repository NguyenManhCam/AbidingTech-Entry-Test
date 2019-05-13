import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DiscountCodeComponent } from './discount-code.component';
import { DiscountCodeRoutes } from './discount-code.routing';

@NgModule({
  imports: [
    CommonModule,
    DiscountCodeRoutes
  ],
  declarations: [DiscountCodeComponent]
})
export class DiscountCodeModule { }
