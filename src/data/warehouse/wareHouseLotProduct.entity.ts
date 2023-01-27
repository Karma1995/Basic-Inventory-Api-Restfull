import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  RelationId,
} from 'typeorm';
import { WareHouse } from './wareHouse.entity';

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
    name: 'nLastCount',
    type: 'decimal',
    precision: 12,
    scale: 2,
  })
  lastCount: number;
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

  @RelationId((lot: WareHouseLotProduct) => lot.wareHouse)
  wareHouseId: number;

  @ManyToOne(() => WareHouse, (wareHouse) => wareHouse.lots)
  @JoinColumn({
    name: 'nWareHouseId',
  })
  wareHouse: WareHouse;
}
