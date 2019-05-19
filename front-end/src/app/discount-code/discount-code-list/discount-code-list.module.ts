import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DiscountCodeListComponent } from './discount-code-list.component';
import { PaginationModule } from 'src/app/pagination/pagination.module';
import { DiscountCodeListRoutes } from './discount-code-list.routing';
import { PipeModule } from '../pipe/pipe.module';

@NgModule({
  imports: [
    CommonModule,
    PaginationModule,
    PipeModule,
    DiscountCodeListRoutes
  ],
  declarations: [DiscountCodeListComponent]
})
export class DiscountCodeListModule { }
