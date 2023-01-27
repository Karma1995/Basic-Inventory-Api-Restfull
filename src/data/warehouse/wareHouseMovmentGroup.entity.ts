import {
  Entity,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
  Column,
  RelationId,
} from 'typeorm';
import { WareHouse } from './wareHouse.entity';
@Entity()
export class WareHouseMovementGroup {
  @PrimaryGeneratedColumn({
    name: 'nWareHouseMovementGroupId',
  })
  id: number;
  @Column({
    name: 'Date',
    type: 'datetime',
  })
  date: string;
  @Column({
    name: 'nWareHouseDestinationId',
  })
  wareHouseDestinationId?: number;
  @RelationId((group: WareHouseMovementGroup) => group.wareHouse)
  wareHouseId: number;

  @ManyToOne(() => WareHouse)
  @JoinColumn({
    name: 'nWareHouseId',
  })
  wareHouse: WareHouse;
}
