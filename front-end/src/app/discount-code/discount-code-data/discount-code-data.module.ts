import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DiscountCodeDataComponent } from './discount-code-data.component';
import { DiscountCodeDataRoutes } from './discount-code-data.routing';

@NgModule({
  imports: [
    CommonModule,
    DiscountCodeDataRoutes
  ],
  declarations: [DiscountCodeDataComponent]
})
export class DiscountCodeDataModule { }
