import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
  OneToMany,
  RelationId,
} from 'typeorm';
import { WareHouseStockManagement } from '../classifiers/wareHouseStockManagement.entity';
import { WareHouseLotProduct } from './wareHouseLotProduct.entity';
import { WareHouseMovement } from './wareHouseMovement.entity';
import { WareHouseStock } from './wareHouseStock';

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
    name: 'bMain',
    type: 'boolean',
  })
  main: boolean;
  @RelationId((wareHouse: WareHouse) => wareHouse.typeStockManagement)
  typeStockManagementId: number;

  @ManyToOne(() => WareHouseStockManagement)
  @JoinColumn({
    name: 'nTypeStockManagementId',
  })
  typeStockManagement: WareHouseStockManagement;
  @OneToMany(() => WareHouseLotProduct, (lot) => lot.wareHouse, {
    cascade: true,
  })
  lots: WareHouseLotProduct[];
  @OneToMany(() => WareHouseMovement, (movement) => movement.wareHouse, {
    cascade: true,
  })
  movements: WareHouseMovement[];
  @OneToMany(() => WareHouseStock, (stock) => stock.wareHouse, {
    cascade: true,
  })
  stocks: WareHouseStock[];

  // @OneToMany(() => WareHouseMovementGroup, (group) => group.wareHouse, {
  //   cascade: true,
  // })
  // groups: WareHouseMovementGroup[];
}
