import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { DecimalPipe, DatePipe } from '@angular/common';
import * as voucherCodes from 'voucher-code-generator';
import { Status, Action, PromotionOption, ApplyWith, CustomerGroupEnum } from './discount-code-enum';
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

  getDiscountCode(params: any = new PagingParams): Observable<Paging> {
    const options = { headers: this.httpOptions.headers, params: params };
    return this.http.get<Paging>(this.baseUrl, options)
      .pipe(
        catchError(this.handleError<Paging>('getHeroes'))
      );
  }

  postDiscountCode(data: DiscountCode): Observable<DiscountCode[]> {
    return this.http.post<DiscountCode[]>(this.baseUrl, data, this.httpOptions)
      .pipe(
        catchError(this.handleError<DiscountCode[]>('postHeroes', []))
      );
  }

  updateDiscountCode(id: number, data: DiscountCode): Observable<DiscountCode[]> {
    return this.http.put<DiscountCode[]>(`${this.baseUrl}/${id}`, data, this.httpOptions)
      .pipe(
        catchError(this.handleError<DiscountCode[]>('updateHeroes', []))
      );
  }

  patchDiscountCode(id: number, action: Action): Observable<DiscountCode[]> {
    return this.http.patch<DiscountCode[]>(`${this.baseUrl}/${id}`, { action: action }, this.httpOptions)
      .pipe(
        catchError(this.handleError<DiscountCode[]>('updateHeroes', []))
      );
  }

  deleteDiscountCode(id: number): Observable<boolean> {
    return this.http.delete<boolean>(`${this.baseUrl}/${id}`)
      .pipe(
        catchError(this.handleError<boolean>('deleteHeroes'))
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    };
  }

  getDesc(data: DiscountCode, name: { applyWithName?: string, customerGroupName?: string }, isDetail = true): string[] {
    let result = [];
    const unit = data.promotionOption == PromotionOption.Percent ? '%' : 'đ';
    let applyWith = '';
    switch (data.applyWith) {
      case ApplyWith.AllOrder:
        applyWith = 'Toàn bộ đơn hàng';
        break;
      case ApplyWith.Product:
        applyWith = `${data.discountCodeProductGroups.length} sản phẩm`;
        break;
      case ApplyWith.ProductGroup:
        applyWith = `danh mục ${name.applyWithName}`;
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
        customerGroup = `nhóm khách hàng ${name.customerGroupName}`;
        break;
      default:
        break;
    }
    const endTime = data.endTime ? ` đến ${this.datePipe.transform(data.endTime, this.dateFormat)}` : '';
    const customerUsageLimits = data.customerUsageLimits ? 'ỗi khách hàng được sử dụng 1 lần' : '';
    const numberUsageLimits = data.numberUsageLimits ? `Mã được sử dụng ${this.decimalPipe.transform(data.numberUsageLimits)} lần` : '';
    const seperate = numberUsageLimits && customerUsageLimits ? ', m' : customerUsageLimits ? 'M' : '';
    const descData = {
      desc1: data.promotionValue ? `Giảm ${this.decimalPipe.transform(data.promotionValue)}${unit} cho ${applyWith}` : '',
      desc2: data.minValue ? `Tổng giá trị sản phẩm được khuyến mãi tối thiểu ${this.decimalPipe.transform(data.minValue)}đ` : '',
      desc3: `Áp dụng với ${customerGroup}`,
      desc4: `${numberUsageLimits}${seperate}${customerUsageLimits}`,
      desc5: `Áp dụng từ ${this.datePipe.transform(data.startTime, this.dateFormat)}${endTime}`,
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
