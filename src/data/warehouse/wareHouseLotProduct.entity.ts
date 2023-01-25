import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class WareHouseLotProduct {
  @PrimaryGeneratedColumn({
    name: 'nWareHouseLotProductId',
  })
  id: number;
  @Column({
    name: 'nInitialCount',
    type: 'decimal',
    precision: 12,
    scale: 2,
  })
  initialCount: number;
  @Column({
    name: 'nCurrentCount',
    type: 'decimal',
    precision: 12,
    scale: 2,
  })
  currentCount: number;
  @Column({
    name: 'nUnitPrice',
    type: 'decimal',
    precision: 12,
    scale: 2,
  })
  unitPrice: number;
  @Column({
    name: 'nTotalValue',
    type: 'decimal',
    precision: 12,
    scale: 2,
  })
  totalValue: number;
  @Column({
    name: 'sCode',
    length: 50,
    unique: true,
  })
  code: string;
  @Column({
    name: 'dEntryDate',
    type: 'datetime',
  })
  entryDate: string;
  @Column({
    name: 'dExitDate',
    type: 'datetime',
    nullable: true,
  })
  exitDate: string;
  @Column({
    name: 'bIsActive',
    type: 'bool',
  })
  isActive: boolean;
  @Column({
    name: 'nProductId',
  })
  productId: number;
  @Column({
    name: 'nUnitMeasuramentId',
  })
  unitMeasuramentId: number;
  @Column({
    name: 'nWareHouseId',
  })
  wareHouseId: number;
}
