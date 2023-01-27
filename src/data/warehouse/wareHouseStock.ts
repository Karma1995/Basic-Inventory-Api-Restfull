import { WareHouse } from './wareHouse.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
  OneToMany,
  RelationId,
} from 'typeorm';
@Entity()
export class WareHouseStock {
  @PrimaryGeneratedColumn({
    name: 'nWareHouseStockId',
  })
  id: number;
  @Column({
    name: 'nProductId',
  })
  productId: number;
  @Column({
    name: 'nAmount',
    type: 'decimal',
    precision: 12,
    scale: 2,
  })
  amount: number;
  @RelationId((stock: WareHouseStock) => stock.wareHouse)
  wareHouseId: number;
  @ManyToOne(() => WareHouse)
  @JoinColumn({
    name: 'nWareHouseId',
  })
  wareHouse: WareHouse;
}
