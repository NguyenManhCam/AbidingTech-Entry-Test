import { Pipe, PipeTransform } from '@angular/core';
import { DiscountCodeService } from '../discount-code.service'
import { Status } from '../discount-code-enum';

@Pipe({
  name: 'discountCodeStatus'
})
export class DiscountCodePipe implements PipeTransform {

  constructor(private discountCodeService: DiscountCodeService) { }
  transform(value: Status): string {
    let status = this.discountCodeService.listStatus.find(x => x.id === value);
    return status ? status.name : '';
  }
}

