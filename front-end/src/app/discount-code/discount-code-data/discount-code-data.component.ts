import { Component, OnInit, TemplateRef, ViewEncapsulation } from '@angular/core';
import { DiscountCodeService } from '../discount-code.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { PromotionOption, ApplyWith, CustomerGroupEnum, Action, Status } from '../discount-code-enum';
import { DiscountCode } from '../discount-code-interface';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-discount-code-data',
  templateUrl: './discount-code-data.component.html',
  styleUrls: ['./discount-code-data.component.scss'],
  encapsulation: ViewEncapsulation.None

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
  myForm: FormGroup;
  discountCode = new DiscountCode;
  unit = '%';
  isDisableMinValue = true;
  isDisableNumberUsageLimits = true;
  applyWithEnum = ApplyWith;
  customerGroupEnum = CustomerGroupEnum;
  nameData = {
    applyWithName: 'Test',
    customerGroupName: 'Test'
  }
  btnCopy = 'Copy link';
  modalRef: BsModalRef;
  constructor(
    public discountCodeService: DiscountCodeService,
    private formBuilder: FormBuilder,
    private router: Router,
    private modalService: BsModalService
  ) { }

  ngOnInit() {
    this.createForm();
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  closeModal(template: TemplateRef<any>) {
    this.modalRef.hide();
  }

  createForm() {
    this.discountCode.code = this.discountCodeService.generateCode();
    this.myForm = this.formBuilder.group({
      code: [this.discountCode.code],
      applyWith: [this.discountCode.applyWith],
      customerGroup: [this.discountCode.customerGroup],
      customerUsageLimits: [this.discountCode.customerUsageLimits],
      minValue: [this.discountCode.minValue],
      numberUsageLimits: [this.discountCode.numberUsageLimits],
      promotionOption: [this.discountCode.promotionOption],
      promotionValue: [this.discountCode.promotionValue],
      startTime: [this.discountCode.startTime],
      endTime: [this.discountCode.endTime],
    });
  }

  onSubmit() {
    console.log(this.myForm.value);

  }

  search(value: any) {
    console.log(value.value);
  }

  onChangePromotion() {
    const promotionOption = parseInt(this.myForm.get('promotionOption').value);
    switch (promotionOption) {
      case PromotionOption.Percent:
        this.unit = '%';
        break;
      case PromotionOption.Money:
        this.unit = 'đ';
        break;
      default:
        break;
    }
  }

  onDisableMinValue() {
    this.isDisableMinValue = !this.isDisableMinValue;
    if (this.isDisableMinValue) {
      this.myForm.get('minValue').setValue(null);
    }
  }

  onDisableNumberUsageLimits() {
    this.isDisableNumberUsageLimits = !this.isDisableNumberUsageLimits;
    if (this.isDisableNumberUsageLimits) {
      this.myForm.get('numberUsageLimits').setValue(null);
    }
  }

  generateCode() {
    const code = this.discountCodeService.generateCode();
    this.myForm.get('code').setValue(code);
  }

  cancel() {
    this.router.navigate(['/discount-code']);
  }

  async stop(template: TemplateRef<any>) {
    this.closeModal(template);
    const isOk = await this.discountCodeService.patchDiscountCode(1, Action.Stop);
    if (isOk) {

    }
  }

  copy(element: any) {
    element.select();
    document.execCommand("copy");
  }

}
