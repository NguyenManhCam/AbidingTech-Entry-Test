import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DiscountCodeDataComponent } from './discount-code-data.component';
import { DiscountCodeDataRoutes } from './discount-code-data.routing';
import { NzDatePickerModule, NzTimePickerModule } from 'ng-zorro-antd';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzDatePickerModule,
    NzTimePickerModule,
    DiscountCodeDataRoutes
  ],
  declarations: [DiscountCodeDataComponent]
})
export class DiscountCodeDataModule { }
