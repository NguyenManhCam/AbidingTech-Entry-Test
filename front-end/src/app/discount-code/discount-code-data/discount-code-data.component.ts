import { Component, OnInit } from '@angular/core';
import { DiscountCodeService, ApplyWith, CustomerGroupEnum } from '../discount-code.service';
import { PromotionOption } from '../discount-code.service';

@Component({
  selector: 'app-discount-code-data',
  templateUrl: './discount-code-data.component.html',
  styleUrls: ['./discount-code-data.component.scss']
})
export class DiscountCodeDataComponent implements OnInit {

  listPromotionOption = [
    { id: PromotionOption.Percent, name: 'Theo phần trăm' },
    { id: PromotionOption.Money, name: 'Theo VND' }
  ];
  listApplyWith = [
    { id: ApplyWith.AllOrder, name: 'Tất cả đơn hàng' },
    { id: ApplyWith.ProductGroup, name: 'Phân nhóm sản phẩm' },
    { id: ApplyWith.Product, name: 'Sản phẩm' },
  ];
  listCustomerGroupEnum = [
    { id: CustomerGroupEnum.All, name: 'Tất cả' },
    { id: CustomerGroupEnum.CustomerGroup, name: 'Nhóm khách hàng đã lưu' }
  ];
  constructor(
    private discountCodeService: DiscountCodeService
  ) { }

  ngOnInit() {
  }

}
