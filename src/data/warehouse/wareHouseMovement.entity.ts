import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class WareHouseMovement {
  @PrimaryGeneratedColumn({
    name: 'nWareHouseMovementId',
  })
  id: number;
  @Column({
    name: 'nBeforeCount',
    type: 'decimal',
    precision: 12,
    scale: 2,
  })
  beforeCount: number;
  @Column({
    name: 'nAfterCount',
    type: 'decimal',
    precision: 12,
    scale: 2,
  })
  afterCount: number;
  @Column({
    name: 'nMoveCount',
    type: 'decimal',
    precision: 12,
    scale: 2,
  })
  moveCount: number;
  @Column({
    name: 'nUnitPrice',
    type: 'decimal',
    precision: 12,
    scale: 2,
  })
  unitPrice: number;
  @Column({
    name: 'nTotalPrice',
    type: 'decimal',
    precision: 12,
    scale: 2,
  })
  totalPrice: number;
  @Column({
    name: 'dDate',
    type: 'datetime',
  })
  date: string;
  @Column({
    name: 'nProductId',
  })
  productId: number;
  @Column({
    name: 'nWareHouseId',
  })
  wareHouseId: number;
  @Column({
    name: 'nUnitMeasuramentId',
  })
  unitMeasuramentId: number;
}
