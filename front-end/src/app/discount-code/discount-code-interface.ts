import { ApplyWith, PromotionOption, CustomerGroupEnum } from "./discount-code-enum";

export class DiscountCode {
    id?: number;
    code: string;
    promotionOption: PromotionOption = PromotionOption.Percent
    promotionValue: number;
    minValue: number;
    applyWith: ApplyWith = ApplyWith.AllOrder;
    customerGroup: number;
    numberUsageLimits?: number;
    customerUsageLimits: boolean = true;
    status: CustomerGroupEnum = CustomerGroupEnum.All;
    amountUsed: number = 0;
    startTime: Date = new Date;
    endTime?: Date;
    discountCodeProducts: DiscountCodeProduct[];
    discountCodeProductGroups: DiscountCodeProductGroup[];
    discountCodeCustomerGroups: DiscountCodeCustomerGroup[];
}

export class DiscountCodeCustomerGroup {
    customerGroup: CustomerGroup;
    discountCodeId: number;
    id: number;
}

export class CustomerGroup {
    id: number;
    name: string;
}

export class DiscountCodeProductGroup {
    productGroup: ProductGroup;
    discountCodeId: number;
    id: number;
}

export class ProductGroup {
    id: number;
    name: string;
}

export class DiscountCodeProduct {
    product: Product;
    discountCodeId: number;
    id: number;
}

export class Product {
    id: number;
    name: string;
}

export interface Paging {
    totalItems: number;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
    discountCodes: DiscountCode[];
}

export class PagingParams {
    pageNumber: number = 1;
    pageSize: number = 10;
}