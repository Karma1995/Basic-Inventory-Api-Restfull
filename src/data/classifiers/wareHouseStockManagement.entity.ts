import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
@Entity()
export class WareHouseStockManagement {
  @PrimaryGeneratedColumn({
    name: 'nWareHouseStockManagementId',
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

  static values = {
    FIFO: 1,
    LIFO: 2,
  };
}
