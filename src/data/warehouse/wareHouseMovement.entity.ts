import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
  RelationId,
} from 'typeorm';
import { WareHouse } from './wareHouse.entity';
import { WareHouseMovementType } from '../classifiers/wareHouseMovementType.entity';

@Entity()
export class WareHouseMovement {
  @PrimaryGeneratedColumn({
    name: 'nWareHouseMovementId',
  })
  id: number;
  @RelationId((movement: WareHouseMovement) => movement.type)
  typeId: number;
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
  @RelationId((movement: WareHouseMovement) => movement.wareHouse)
  wareHouseId: number;
  @Column({
    name: 'nUnitMeasuramentId',
  })
  unitMeasuramentId: number;
  @Column({
    name: 'nWareHouseMovementGroupId',
  })
  wareHouseMovementGroupId: number;

  @ManyToOne(() => WareHouseMovementType)
  @JoinColumn({
    name: 'nTypeId',
  })
  type: WareHouseMovementType;

  @ManyToOne(() => WareHouse, (wareHouse) => wareHouse.movements)
  @JoinColumn({
    name: 'nWareHouseId',
  })
  wareHouse: WareHouse;
}
