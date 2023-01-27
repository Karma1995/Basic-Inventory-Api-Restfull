import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { InventoryDetail } from './inventoryDetail.entity';

@Entity()
export class Inventory {
  @PrimaryGeneratedColumn({
    name: 'nInventoryId',
  })
  id: number;
  @Column({
    name: 'dInitialDate',
    type: 'datetime',
  })
  initialDate: string;
  @Column({
    name: 'dEndDate',
    type: 'datetime',
  })
  endDate: string;
  @Column({
    name: 'sProductType',
    length: 20,
  })
  productType: string;

  @Column({
    name: 'sDescription',
  })
  description: string;
  @Column({
    name: 'nTotalValue',
    type: 'decimal',
    precision: 12,
    scale: 2,
  })
  totalValue: number;
  @Column({
    name: 'nTotalValueAdded',
    type: 'decimal',
    precision: 12,
    scale: 2,
  })
  totalValueAdded: number;
  @Column({
    name: 'nTotalValueRemoved',
    type: 'decimal',
    precision: 12,
    scale: 2,
  })
  totalValueRemoved: number;

  @OneToMany(() => InventoryDetail, (d) => d.inventory, {
    cascade: true,
  })
  details: InventoryDetail[];
}
