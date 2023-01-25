import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn({
    name: 'nProductId',
  })
  id: number;
  @Column({
    name: 'nTypeId',
  })
  typeId: number;
  @Column({
    name: 'sName',
    length: 100,
  })
  name: string;
  @Column({
    name: 'sDescription',
    length: 200,
  })
  description: string;
  @Column({
    name: 'nUnitMeasuramentId',
  })
  unitMeasuramentId: number;
}
