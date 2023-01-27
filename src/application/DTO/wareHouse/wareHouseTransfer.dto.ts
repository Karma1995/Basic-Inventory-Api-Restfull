export class WareHouseTransfer {
  sourceWareHouseId: number;
  destinationWareHouseId: number;
  details: WareHouseTransfer_Detail[];
}
export class WareHouseTransfer_Detail {
  productId: number;
  count: number;
}
