export class SellCreate {
  addicionalDiscount: number;
  paymentTypeId: number;
  currencyId: number;
  details: SellCreate_Detail[];
}

export class SellCreate_Detail {
  productId: number;
  unitPrice: number;
  discountAmount: number;
  count: number;
}
