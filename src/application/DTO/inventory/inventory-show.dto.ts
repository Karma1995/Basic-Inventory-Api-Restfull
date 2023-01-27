export class InventoryShow {
  id: number;
  startDate: string;
  endDate: string;
  productTypesNames: string[];
  description: string;
  totalValue: number;
  totalValueAdded: number;
  totalValueRemoved: number;
  details: InventoryShow_Detail[];
}

export class InventoryShow_Detail {
  product: {
    name: string;
    id: number;
  };
  unitMeasurament: {
    name: string;
    id: number;
  };
  totalAmount: number;
  totalAmountAdded: number;
  totalAmountRemoved: number;
  subTotalValueAdded: number;
  subTotalValueRemoved: number;
  subTotalValue: number;
}
