import { Pipe, PipeTransform } from '@angular/core';
import { Status, DiscountCodeService } from './discount-code.service'

@Pipe({
  name: 'DiscountCodeStatus'
})
export class DiscountCodePipe implements PipeTransform {

  constructor(private discountCodeService: DiscountCodeService) { }
  transform(value: Status): string {
    let status = this.discountCodeService.listStatus.find(x => x.id === value);
    return status ? status.name : '';
  }
}

