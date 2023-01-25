import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
@Entity()
export class Currency {
  @PrimaryGeneratedColumn({
    name: 'nCurrencyId',
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
