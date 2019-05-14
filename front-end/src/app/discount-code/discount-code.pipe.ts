import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'discount-code'
})
export class DiscountCodePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return null;
  }

}
