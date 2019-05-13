import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DiscountCodeListComponent } from './discount-code-list.component';
import { DiscountCodeListRoutes } from './discount-code-list.routing';

@NgModule({
  imports: [
    CommonModule,
    DiscountCodeListRoutes
  ],
  declarations: [DiscountCodeListComponent]
})
export class DiscountCodeListModule { }
