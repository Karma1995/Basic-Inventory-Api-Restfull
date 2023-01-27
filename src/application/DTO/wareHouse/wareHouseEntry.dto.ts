export class WareHouseEntry {
  wareHouseId: number;
  Lots: WareHouseEntry_Lot[];
}
export class WareHouseEntry_Lot {
  productId: number;
  count: number;
  unitPrice: number;
}
