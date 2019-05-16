import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DiscountCodeListComponent } from './discount-code-list.component';
import { DiscountCodeListRoutes } from './discount-code-list.routing';
import { PaginationModule } from 'src/app/pagination/pagination.module';

@NgModule({
  imports: [
    CommonModule,
    PaginationModule,
    DiscountCodeListRoutes
  ],
  declarations: [DiscountCodeListComponent]
})
export class DiscountCodeListModule { }
