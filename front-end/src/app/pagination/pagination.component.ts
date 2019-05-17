import { Component, OnInit, Input } from '@angular/core';
import { Paging } from '../discount-code/discount-code-interface';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnInit {

  @Input() paging: Paging;
  startIndex: number;
  endIndex: number;
  constructor() { }

  ngOnInit() {
    this.startIndex = this.paging.pageSize * (this.paging.pageNumber - 1) + 1;
    this.endIndex = this.startIndex + this.paging.discountCodes.length - 1;
  }

}
