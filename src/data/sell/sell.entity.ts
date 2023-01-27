import {
  Column,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PaymentType } from '../classifiers/paymentType.entity';
import { Currency } from '../classifiers/currency.entity';
import { SellDetail } from './sell-detail.entity';
import { Entity } from 'typeorm';
@Entity()
export class Sell {
  @PrimaryGeneratedColumn({
    name: 'nSellId',
  })
  id: number;
  @Column({
    name: 'dDate',
    type: 'datetime',
  })
  date: string;
  @Column({
    name: 'nTotalAmount',
    type: 'decimal',
    precision: 12,
    scale: 2,
  })
  totalAmount: number;
  @Column({
    name: 'nAddicionalDiscount',
    type: 'decimal',
    precision: 12,
    scale: 2,
  })
  addicionalDiscount: number;
  @Column({
    name: 'nTotalPaymentAmount',
    type: 'decimal',
    precision: 12,
    scale: 2,
  })
  totalPaymentAmount: number;
  @Column({
    name: 'nIvaCharge',
    type: 'decimal',
    precision: 12,
    scale: 2,
  })
  ivaCharge: number;
  @ManyToOne(() => PaymentType)
  @JoinColumn({
    name: 'nPaymentTypeId',
  })
  paymentTypeId: number;
  @ManyToOne(() => Currency)
  @JoinColumn({
    name: 'nCurrencyId',
  })
  currencyId: number;

  @OneToMany(() => SellDetail, (d) => d.sell, {
    cascade: true,
  })
  details: SellDetail[];
}
