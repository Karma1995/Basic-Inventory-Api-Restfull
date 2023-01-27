export class ProductShow {
  id: number;
  name: string;
  description: string;
  type: {
    id: number;
    name: string;
  };
  unitMeasurament: {
    id: number;
    simbol: string;
    name: string;
  };
}
