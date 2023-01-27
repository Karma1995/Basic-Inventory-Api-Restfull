import {
  Column,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Entity,
} from 'typeorm';
import { Product } from '../product/product.entity';
import { Sell } from './sell.entity';
@Entity()
export class SellDetail {
  @PrimaryGeneratedColumn({
    name: 'nSellDetailId',
  })
  id: number;
  @Column({
    name: 'nSubTotalAmount',
    type: 'decimal',
    precision: 12,
    scale: 2,
  })
  subTotalAmount: number;
  @Column({
    name: 'nDiscountAmount',
    type: 'decimal',
    precision: 12,
    scale: 2,
  })
  discountAmount: number;
  @Column({
    name: 'nUnitPrice',
    type: 'decimal',
    precision: 12,
    scale: 2,
  })
  unitPrice: number;
  @Column({
    name: 'nCount',
    type: 'decimal',
    precision: 12,
    scale: 2,
  })
  count: number;
  @ManyToOne(() => Product)
  @JoinColumn({
    name: 'nProductId',
  })
  productId: number;
  @ManyToOne(() => Sell)
  @JoinColumn({
    name: 'nSellId',
  })
  sell: number;
}
