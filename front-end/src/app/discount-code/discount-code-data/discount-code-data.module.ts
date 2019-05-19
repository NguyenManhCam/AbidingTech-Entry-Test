import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DiscountCodeDataComponent } from './discount-code-data.component';
import { DiscountCodeDataRoutes } from './discount-code-data.routing';
import { NzDatePickerModule, NzTimePickerModule } from 'ng-zorro-antd';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PipeModule } from '../pipe/pipe.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzDatePickerModule,
    NzTimePickerModule,
    PipeModule,
    DiscountCodeDataRoutes
  ],
  declarations: [DiscountCodeDataComponent]
})
export class DiscountCodeDataModule { }
