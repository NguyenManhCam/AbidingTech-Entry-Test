import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DiscountCodePipe } from './discount-code-status.pipe';

@NgModule({
    imports: [
        CommonModule
    ],
    exports: [
        DiscountCodePipe
    ],
    declarations: [
        DiscountCodePipe
    ]
})
export class PipeModule { }
