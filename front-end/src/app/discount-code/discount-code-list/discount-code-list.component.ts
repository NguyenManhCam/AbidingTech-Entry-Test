import { Component, OnInit, TemplateRef } from '@angular/core';
import { DiscountCodeService } from '../discount-code.service';
import { Status, Action } from '../discount-code-enum';
import { DiscountCode, Paging, PagingParams } from '../discount-code-interface';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-discount-code-list',
  templateUrl: './discount-code-list.component.html',
  styleUrls: ['./discount-code-list.component.scss']
})
export class DiscountCodeListComponent implements OnInit {

  statusEnum = Status;
  actionEnum = Action;
  data: DiscountCode[] = [];
  selectedData: number[] = [];
  isIndeterminate = false;
  dataPage: Paging;
  pageParams = new PagingParams;
  modalRef: BsModalRef;
  copyCode = '';
  constructor(
    public discountCodeService: DiscountCodeService,
    private modalService: BsModalService
  ) { }

  ngOnInit() {
    this.getData();
  }

  async getData(page: number = 1) {
    this.pageParams.pageNumber = page;
    this.dataPage = await this.discountCodeService.getDiscountCode(this.pageParams);
    this.data = this.dataPage.discountCodes;
  }

  onCheckAll(checked: boolean): void {
    let data = this.data.map(x => x.id);
    if (checked) {
      this.selectedData = this.selectedData.concat(data);
    } else {
      this.selectedData = this.selectedData.filter(id => !data.includes(id))
    }
  }

  onCheck(checked: boolean, id: number): void {
    let index = this.selectedData.indexOf(id);
    if (checked && index === -1) {
      this.selectedData.push(id);
    } else if (!checked && index !== -1) {
      this.selectedData.splice(index, 1);
    }
  }

  get isAllChecked() {
    return this.data.map(d => d.id).some(id => this.selectedData.includes(id));
  }

  isSelected(id: number): boolean {
    const index = this.selectedData.indexOf(id);
    return index !== -1;
  }

  openModal(template: TemplateRef<any>, code: string) {
    this.copyCode = code;
    this.modalRef = this.modalService.show(template);
  }

  closeModal() {
    this.modalRef.hide();
  }

  copy(element: any) {
    element.select();
    document.execCommand("copy");
  }

  async updateStatus(action: Action) {
    const tasks = this.selectedData.map(id => {
      return this.discountCodeService.patchDiscountCode(id, action);
    });
    const rs = await Promise.all(tasks);
    if (rs.every(isOk => isOk)) {

    }
    this.getData(this.dataPage.pageNumber);
  }

  async delete() {
    const tasks = this.selectedData.map(id => {
      return this.discountCodeService.deleteDiscountCode(id);
    });
    const rs = await Promise.all(tasks);
    if (rs.every(isOk => isOk)) {
      this.selectedData = [];
    }
    this.getData(this.dataPage.pageNumber);
  }
}
