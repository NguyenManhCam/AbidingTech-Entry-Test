import { Component, OnInit, TemplateRef, ViewEncapsulation, OnDestroy } from '@angular/core';
import { DiscountCodeService } from '../discount-code.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { PromotionOption, ApplyWith, CustomerGroupEnum, Action, Status, CategoryType } from '../discount-code-enum';
import { DiscountCode, Product, ProductGroup, CustomerGroup } from '../discount-code-interface';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-discount-code-data',
  templateUrl: './discount-code-data.component.html',
  styleUrls: ['./discount-code-data.component.scss'],
  encapsulation: ViewEncapsulation.None

})
export class DiscountCodeDataComponent implements OnInit, OnDestroy {

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
  isDisableMinValue = false;
  isDisableNumberUsageLimits = false;
  applyWithEnum = ApplyWith;
  customerGroupEnum = CustomerGroupEnum;
  btnCopy = 'Copy link';
  listProducts: Product[] = [];
  listProductGroups: ProductGroup[] = [];
  listCustomerGroups: CustomerGroup[] = [];
  productsSelected: Product[] = [];
  productGroupsSelected: ProductGroup[] = [];
  customerGroupsSelected: CustomerGroup[] = [];
  categoryTypeEnum = CategoryType;
  statusEnum = Status;
  modalRef: BsModalRef;
  id: number;
  sub: Subscription;
  isShowAlert = false;
  titleAlear = 'tạo';
  dataConfirm = {
    title: '',
    content: '',
    ok: '',
    cancel: ''
  }
  dataStop = {
    title: '',
    content: '',
    ok: '',
  }

  constructor(
    private discountCodeService: DiscountCodeService,
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private modalService: BsModalService
  ) { }

  async ngOnInit() {
    this.discountCode.id = this.activatedRoute.snapshot.params.id;
    this.createForm();
    if (this.discountCode.id) {
      await this.findOne(this.discountCode.id);
    } else {
      this.discountCode.code = this.discountCodeService.generateCode();
    }
    this.sub = this.myForm.valueChanges.subscribe(_ => {
      this.setDiscount();
    });
    this.setForm();
    this.getCategory();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  setForm() {
    let formData = this.myForm.value;
    Object.keys(formData).forEach(key => {
      this.myForm.get(key).setValue(this.discountCode[key]);
    });
  }

  setDiscount() {
    let formData = this.myForm.value;
    Object.keys(formData).forEach(key => {
      this.discountCode[key] = formData[key];
    });
    switch (this.discountCode.applyWith) {
      case ApplyWith.AllOrder:
        break;
      case ApplyWith.Product:
        this.discountCode.discountCodeProducts = this.productsSelected.map(x => {
          return {
            id: x.id,
            product: x
          }
        });
        break;
      case ApplyWith.ProductGroup:
        this.discountCode.discountCodeProductGroups = this.productGroupsSelected.map(x => {
          return {
            id: x.id,
            productGroup: x
          }
        });
        break;
      default:
        break;
    }
    switch (this.discountCode.customerGroup) {
      case CustomerGroupEnum.All:
        break;
      case CustomerGroupEnum.CustomerGroup:
        this.discountCode.discountCodeCustomerGroups = this.customerGroupsSelected.map(x => {
          return {
            id: x.id,
            customerGroup: x
          }
        });
        break;
      default:
        break;
    }
  }

  openModal(template: TemplateRef<any>) {
    if (this.discountCode.status === Status.Applied) {
      this.dataStop = {
        title: `Ngừng khuyến mãi ${this.discountCode.code}`,
        content: `Bạn có chắc chắn muốn ngừng khuyến mãi ${this.discountCode.code}? Khuyến mãi sẽ được cho hết hạn ngay.`,
        ok: 'Ngừng'
      }
    } else {
      this.dataStop = {
        title: 'Tiếp tục khuyến mãi',
        content: `Bạn có chắc chắn muốn tiếp tục khuyến mãi ${this.discountCode.code}? Khuyến mãi sẽ dùng được ngay.`,
        ok: 'Tiếp tục'
      }
    }
    this.modalRef = this.modalService.show(template);
  }

  closeModal() {
    this.modalRef.hide();
  }

  async getCategory() {
    let t1 = this.discountCodeService.getCategory<Product>(CategoryType.Product);
    let t2 = this.discountCodeService.getCategory<ProductGroup>(CategoryType.ProductGroup);
    let t3 = this.discountCodeService.getCategory<CustomerGroup>(CategoryType.CustomerGroup);
    let rs = await Promise.all([t1, t2, t3]);
    this.listProducts = rs[0];
    this.listProductGroups = rs[1];
    this.listCustomerGroups = rs[2];
  }

  createForm() {
    this.myForm = this.formBuilder.group({
      code: [this.discountCode.code],
      promotionOption: [this.discountCode.promotionOption],
      promotionValue: [this.discountCode.promotionValue],
      minValue: [this.discountCode.minValue],
      applyWith: [this.discountCode.applyWith],
      customerGroup: [this.discountCode.customerGroup],
      numberUsageLimits: [this.discountCode.numberUsageLimits],
      customerUsageLimits: [this.discountCode.customerUsageLimits],
      startTime: [this.discountCode.startTime],
      endTime: [this.discountCode.endTime]
    });
  }

  onSubmit(template: TemplateRef<any>) {
    if (this.discountCode.id) {
      this.dataConfirm = {
        title: 'Cập nhật khuyến mãi',
        content: `Bạn có chắc chắn muốn cập nhật lại mã khuyến mãi ${this.discountCode.code} này không?`,
        ok: 'Cập nhật',
        cancel: 'Hủy'
      };
    } else {
      this.dataConfirm = {
        title: 'Tạo mới khuyến mãi',
        content: `Bạn có chắc chắn muốn tạo mới mã khuyến mãi ${this.discountCode.code} này không?`,
        ok: 'Tạo mới',
        cancel: 'Không'
      };
    }
    this.openModal(template);
  }

  async submit() {
    this.closeModal();
    if (this.discountCode.id) {
      this.discountCode = await this.discountCodeService.updateDiscountCode(this.discountCode.id, this.discountCode);
      this.titleAlear = 'cập nhật';
    } else {
      this.discountCode = await this.discountCodeService.postDiscountCode(this.discountCode);
      this.titleAlear = 'tạo';
    }
    this.isShowAlert = true;
  }

  async findOne(id: number) {
    this.discountCode = await this.discountCodeService.findOne(id);
    if (!this.discountCode) {
      this.router.navigate(['/']);
    }
  }

  get descs() {
    return this.discountCodeService.getDesc(this.discountCode);
  }

  onChangeCategory(categoryType: CategoryType, id: any, isPush = true) {
    id = parseInt(id);
    let listCategory = [];
    let listSelection = [];
    switch (categoryType) {
      case CategoryType.Product:
        listCategory = this.productsSelected;
        listSelection = this.listProducts;
        break;
      case CategoryType.ProductGroup:
        listCategory = this.productGroupsSelected;
        listSelection = this.listProductGroups;
        break;
      case CategoryType.CustomerGroup:
        listCategory = this.customerGroupsSelected;
        listSelection = this.listCustomerGroups;
        break;
      default:
        break;
    }
    const category = listSelection.find(x => x.id === id);
    const index = listCategory.indexOf(category);
    if (isPush && index === -1) {
      listCategory.push(category);
    } else if (!isPush && index !== -1) {
      listCategory.splice(index, 1);
    }
    this.setDiscount();
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

  async updateStatus() {
    this.closeModal();
    const action = this.discountCode.status === Status.Applied ? Action.Stop : Action.Continue;
    const isOk = await this.discountCodeService.patchDiscountCode(this.discountCode.id, action);
    if (isOk) {
      this.findOne(this.discountCode.id);
    }
  }

  copy(element: any) {
    element.select();
    document.execCommand("copy");
  }

}
