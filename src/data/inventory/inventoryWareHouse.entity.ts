import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class InventoryWareHouse {
  @PrimaryGeneratedColumn({
    name: 'nInventoryWareHouseId',
  })
  id: number;
  @Column({
    name: 'nWareHouseId',
  })
  wareHouseId: number;
  @Column({
    name: 'nInventoryId',
  })
  inventoryId: number;
}
