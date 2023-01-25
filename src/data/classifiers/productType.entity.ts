import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
@Entity()
export class ProductType {
  @PrimaryGeneratedColumn({
    name: 'nProductTypeId',
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
