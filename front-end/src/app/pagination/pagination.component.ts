import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { Paging } from '../discount-code/discount-code-interface';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnInit, OnChanges {

  @Input() paging: Paging;
  @Output() onChange = new EventEmitter<number>();
  startIndex: number;
  endIndex: number;
  listPage = [];
  constructor() { }

  ngOnInit() {

  }

  calculatePage() {
    this.listPage = [];
    this.startIndex = this.paging.pageSize * (this.paging.pageNumber - 1) + 1;
    this.endIndex = this.startIndex + this.paging.discountCodes.length - 1;
    for (let page = 1; page <= this.paging.totalPages; page++) {
      this.listPage.push(page);
    }
  }

  ngOnChanges() {
    this.calculatePage();
  }

  onNext() {
    if (this.paging.pageNumber === this.paging.totalPages) return;
    this.paging.pageNumber++;
    this.onChange.emit(this.paging.pageNumber);
  }

  onPrevious() {
    if (this.paging.pageNumber === 1) return;
    this.paging.pageNumber--;
    this.onChange.emit(this.paging.pageNumber);
  }

  onChangePage(page: number) {
    this.paging.pageNumber = page;
    this.onChange.emit(this.paging.pageNumber);
  }

}
