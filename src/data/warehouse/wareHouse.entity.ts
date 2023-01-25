import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class WareHouse {
  @PrimaryGeneratedColumn({
    name: 'nWareHouseId',
  })
  id: number;
  @Column({
    name: 'dOpeningDate',
    type: 'datetime',
  })
  openingDate: string;
  @Column({
    name: 'sAddress',
    length: 100,
  })
  address: string;
  @Column({
    name: 'sName',
    length: 50,
  })
  name: string;
  @Column({
    name: 'sDescription',
    length: 200,
    nullable: true,
  })
  description: string;
  @Column({
    name: 'bIsActive',
    type: 'bool',
  })
  isActive: boolean;
  @Column({
    name: 'nTypeStockManagementId',
  })
  typeStockManagementId: number;
}
