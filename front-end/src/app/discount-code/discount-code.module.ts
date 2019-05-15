import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DiscountCodeComponent } from './discount-code.component';
import { DiscountCodeRoutes } from './discount-code.routing';
import { DiscountCodePipe } from './discount-code-status.pipe';

@NgModule({
   imports: [
      CommonModule,
      DiscountCodeRoutes
   ],
   declarations: [
      DiscountCodeComponent,
      DiscountCodePipe
   ]
})
export class DiscountCodeModule { }
