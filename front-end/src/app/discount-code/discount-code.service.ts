import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DecimalPipe, DatePipe } from '@angular/common';
import * as voucherCodes from 'voucher-code-generator';
import { Status, Action, PromotionOption, ApplyWith, CustomerGroupEnum, CategoryType } from './discount-code-enum';
import { DiscountCode, Paging, PagingParams } from './discount-code-interface';

export class Category {
  id: number
  name: string
}

@Injectable({
  providedIn: 'root'
})

export class DiscountCodeService {

  listStatus: Category[] = [
    { id: Status.Applied, name: 'Đang áp dụng' },
    { id: Status.NotYetApplied, name: 'Chưa áp dụng' },
    { id: Status.StopApplying, name: 'Ngừng áp dụng' }
  ];
  private baseUrl = 'https://localhost:5001/api/DiscountCode';
  dateFormat = 'd/M/yy h:m a';
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    }),
  };
  constructor(
    private http: HttpClient,
    private decimalPipe: DecimalPipe,
    private datePipe: DatePipe
  ) { }

  getDiscountCode(params: any = new PagingParams): Promise<Paging> {
    if (params.status === null) delete (params.status);
    const options = { headers: this.httpOptions.headers, params: params };
    return this.http.get<Paging>(this.baseUrl, options).toPromise();
  }

  findOne(id: number): Promise<DiscountCode> {
    const options = { headers: this.httpOptions.headers };
    return this.http.get<DiscountCode>(`${this.baseUrl}/${id}`, options).toPromise();
  }

  postDiscountCode(data: DiscountCode): Promise<DiscountCode> {
    return this.http.post<DiscountCode>(this.baseUrl, data, this.httpOptions).toPromise();
  }

  updateDiscountCode(id: number, data: DiscountCode): Promise<DiscountCode> {
    return this.http.put<DiscountCode>(`${this.baseUrl}/${id}`, data, this.httpOptions).toPromise();
  }

  patchDiscountCode(id: number, action: Action): Promise<boolean> {
    return this.http.patch<boolean>(`${this.baseUrl}/${id}?action=${action}`, this.httpOptions).toPromise();
  }

  deleteDiscountCode(id: number): Promise<boolean> {
    return this.http.delete<boolean>(`${this.baseUrl}/${id}`).toPromise();
  }

  getCategory<T>(categoryType: CategoryType): Promise<T[]> {
    const params: any = { categoryType: categoryType };
    const options = { headers: this.httpOptions.headers, params: params };
    return this.http.get<T[]>(`${this.baseUrl}/GetCategory`, options).toPromise();
  }

  getDesc(data: DiscountCode, isDetail = true): string[] {
    const dateFormat = 'd/M/yy h:m a';
    let result = [];
    const unit = data.promotionOption == PromotionOption.Percent ? '%' : 'đ';
    let applyWith = '';
    switch (data.applyWith) {
      case ApplyWith.AllOrder:
        applyWith = 'Toàn bộ đơn hàng';
        break;
      case ApplyWith.Product:
        if (data.discountCodeProducts.length === 1) {
          applyWith = `sản phẩm ${data.discountCodeProducts[0].product.name}`;
        } else if (data.discountCodeProducts.length > 1) {
          applyWith = `${data.discountCodeProducts.length} sản phẩm`;
        }
        break;
      case ApplyWith.ProductGroup:
        if (data.discountCodeProductGroups.length === 1) {
          applyWith = `nhóm sản phẩm ${data.discountCodeProductGroups[0].productGroup.name}`;
        } else if (data.discountCodeProductGroups.length > 1) {
          applyWith = `${data.discountCodeProductGroups.length} nhóm sản phẩm`;
        }
        break;
      default:
        break;
    }
    let customerGroup = '';
    switch (data.customerGroup) {
      case CustomerGroupEnum.All:
        customerGroup = 'Toàn bộ khách hàng';
        break;
      case CustomerGroupEnum.CustomerGroup:
        if (data.discountCodeCustomerGroups.length === 1) {
          customerGroup = `nhóm khách hàng ${data.discountCodeCustomerGroups[0].customerGroup.name}`;
        } else if (data.discountCodeCustomerGroups.length > 1) {
          customerGroup = `${data.discountCodeCustomerGroups.length} nhóm khách hàng`;
        }
        break;
      default:
        break;
    }
    const endTime = data.endTime ? ` đến ${this.datePipe.transform(data.endTime, dateFormat)}` : '';
    const customerUsageLimits = data.customerUsageLimits ? 'ỗi khách hàng được sử dụng 1 lần' : '';
    const numberUsageLimits = data.numberUsageLimits ? `Mã được sử dụng ${this.decimalPipe.transform(data.numberUsageLimits)} lần` : '';
    const seperate = numberUsageLimits && customerUsageLimits ? ', m' : customerUsageLimits ? 'M' : '';
    const descData = {
      desc1: data.promotionValue && applyWith ? `Giảm ${this.decimalPipe.transform(data.promotionValue)}${unit} cho ${applyWith}` : '',
      desc2: data.minValue ? `Tổng giá trị sản phẩm được khuyến mãi tối thiểu ${this.decimalPipe.transform(data.minValue)}đ` : '',
      desc3: customerGroup ? `Áp dụng với ${customerGroup}` : '',
      desc4: `${numberUsageLimits}${seperate}${customerUsageLimits}`,
      desc5: `Áp dụng từ ${this.datePipe.transform(data.startTime, dateFormat)}${endTime}`,
    }
    Object.keys(descData).forEach(key => {
      if (descData[key]) {
        result.push(descData[key]);
      }
    });
    if (!isDetail) result.pop();
    return result;
  }

  generateCode(): string {
    let code = voucherCodes.generate({
      length: 10,
      charset: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    });
    return code[0];
  }

}
