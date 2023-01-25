import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
@Entity()
export class PaymentType {
  @PrimaryGeneratedColumn({
    name: 'nPaymentTypeId',
  })
  id: number;
  @Column({
    name: 'sDescription',
    length: 200,
  })
  description: string;
  @Column({
    name: 'bIsActive',
    type: 'bool',
  })
  isActive: boolean;
}
