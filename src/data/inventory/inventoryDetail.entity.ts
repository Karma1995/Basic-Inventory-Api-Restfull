import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Inventory } from './inventory.entity';

@Entity()
export class InventoryDetail {
  @PrimaryGeneratedColumn({
    name: 'nInventoryDetailId',
  })
  id: number;
  @Column({
    name: 'nProductId',
  })
  productId: number;
  @Column({
    name: 'nUnitMeasuramentId',
  })
  unitMeasuramentId: number;
  @Column({
    name: 'nTotalAmount',
    type: 'decimal',
    precision: 12,
    scale: 2,
  })
  totalAmount: number;
  @Column({
    name: 'nTotalAmountAdded',
    type: 'decimal',
    precision: 12,
    scale: 2,
  })
  totalAmountAdded: number;
  @Column({
    name: 'nTotalAmountRemoved',
    type: 'decimal',
    precision: 12,
    scale: 2,
  })
  totalAmountRemoved: number;
  @Column({
    name: 'nSubTotalValue',
    type: 'decimal',
    precision: 12,
    scale: 2,
  })
  subTotalValue: number;
  @Column({
    name: 'nSubTotalValueAdded',
    type: 'decimal',
    precision: 12,
    scale: 2,
  })
  subTotalValueAdded: number;
  @Column({
    name: 'nSubTotalValueRemoved',
    type: 'decimal',
    precision: 12,
    scale: 2,
  })
  subTotalValueRemoved: number;
  @ManyToOne(() => Inventory)
  @JoinColumn({
    name: 'nInvnetoryId',
  })
  inventory: Inventory;
}
