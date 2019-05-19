import { Component, OnInit } from '@angular/core';
import { DiscountCodeService } from '../discount-code.service';
import { Status, Action } from '../discount-code-enum';
import { DiscountCode, Paging, PagingParams } from '../discount-code-interface';

@Component({
  selector: 'app-discount-code-list',
  templateUrl: './discount-code-list.component.html',
  styleUrls: ['./discount-code-list.component.scss']
})
export class DiscountCodeListComponent implements OnInit {

  statusEnum = Status;
  data: DiscountCode[] = [];
  selectedData: number[] = [];
  isAllChecked = false;
  isIndeterminate = false;
  dataPage: Paging;
  pageParams = new PagingParams;
  constructor(
    public discountCodeService: DiscountCodeService
  ) { }

  ngOnInit() {
    // for (let index = 0; index < 10; index++) {
    //   let data = new DiscountCode;
    //   data.id = index;
    //   data.promotionValue = index;
    //   data.minValue = index;
    //   this.data.push(data);
    // }
    this.getData();
  }

  async getData(page: number = 1) {
    this.pageParams.pageNumber = page;
    this.dataPage = await this.discountCodeService.getDiscountCode(this.pageParams);
    this.data = this.dataPage.discountCodes;
  }

  onCheckAll(checked: boolean): void {
    if (checked) {
      this.selectedData = this.data.map(x => x.id);
    } else {
      this.selectedData = [];
    }
  }

  onCheck(checked: boolean, id: number): void {
    let index = this.selectedData.indexOf(id);
    if (checked) {
      if (index === -1) {
        this.selectedData.push(id);
      }
    } else {
      if (index !== -1) {
        this.selectedData.splice(index, 1);
      }
    }
    this.isAllChecked = this.selectedData.length !== 0;
  }

  isSelected(id: number): boolean {
    const index = this.selectedData.indexOf(id);
    return index !== -1;
  }

  async updateStatus(action: Action) {
    const tasks = this.selectedData.map(id => {
      return this.discountCodeService.patchDiscountCode(id, action);
    });
    const rs = await Promise.all(tasks);
    if (rs.every(isOk => isOk)) {
      console.log('OK');
    }
  }

  async delete() {
    const tasks = this.selectedData.map(id => {
      return this.discountCodeService.deleteDiscountCode(id);
    });
    const rs = await Promise.all(tasks);
    if (rs.every(isOk => isOk)) {
      console.log('OK');
    }
  }
}
