import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DiscountCodeListComponent } from './discount-code-list.component';
import { PaginationModule } from 'src/app/pagination/pagination.module';
import { DiscountCodeListRoutes } from './discount-code-list.routing';
import { DiscountCodePipe } from '../discount-code-status.pipe';

@NgModule({
  imports: [
    CommonModule,
    PaginationModule,
    DiscountCodeListRoutes
  ],
  declarations: [DiscountCodeListComponent, DiscountCodePipe]
})
export class DiscountCodeListModule { }
