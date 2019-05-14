import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { DecimalPipe } from '@angular/common';


export enum PromotionOption {
  Percent,
  Money
}

export enum ApplyWith {
  AllOrder,
  ProductGroup,
  Product
}

export enum CustomerGroup {
  All,
  CustomerGroup
}

export enum Status {
  NotYetApplied,
  Applied,
  StopApplying
}

export class DiscountCode {
  id: number;
  code: string;
  promotionOption: PromotionOption
  promotionValue: number
  minValue: number
  applyWith: number
  customerGroup: number
  numberUsageLimits: number
  customerUsageLimits: boolean = true
  status: Status
  amountUsed: number = 0
  startTime: Date
  endTime: Date
}

@Injectable({
  providedIn: 'root'
})

export class DiscountCodeService {

  private baseUrl = ''
  constructor(
    private http: HttpClient,
    private decimalPipe: DecimalPipe
  ) { }

  getDiscountCode(): Observable<DiscountCode[]> {
    return this.http.get<DiscountCode[]>(this.baseUrl)
      .pipe(
        catchError(this.handleError<DiscountCode[]>('getHeroes', []))
      );
  }

  postDiscountCode(data: DiscountCode): Observable<DiscountCode[]> {
    return this.http.post<DiscountCode[]>(this.baseUrl, data, { headers: new HttpHeaders() })
      .pipe(
        catchError(this.handleError<DiscountCode[]>('postHeroes', []))
      );
  }

  updateDiscountCode(data: DiscountCode): Observable<DiscountCode[]> {
    return this.http.put<DiscountCode[]>(this.baseUrl, data, { headers: new HttpHeaders() })
      .pipe(
        catchError(this.handleError<DiscountCode[]>('updateHeroes', []))
      );
  }

  deleteDiscountCode(): Observable<DiscountCode[]> {
    return this.http.delete<DiscountCode[]>(this.baseUrl)
      .pipe(
        catchError(this.handleError<DiscountCode[]>('deleteHeroes', []))
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead
      return of(result as T);
    };
  }

  getDesc(data: DiscountCode): string[] {
    let result = [];
    const descData = {
      desc1: `Giảm ${data.promotionValue}${data.promotionOption === PromotionOption.Percent ? '%' : 'đ'} cho 2 sảm phẩm`,
      desc2: 'Tổng giá trị sản phẩm được khuyến mãi tối thiểu ${this.decimalPipe.transform(data.minValue)}đ',
      desc3: '',
      desc4: 'Mã được sử dụng ${data.numberUsageLimits} lần',
      desc5: 'Áp dụng từ ${data.startTime} đến ${data.endTime}',
    }
    Object.keys(descData).forEach(key => {
      result.push(descData[key]);
    });
    return result;
  }

}
