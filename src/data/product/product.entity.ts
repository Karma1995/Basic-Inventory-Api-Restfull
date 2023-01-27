import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  RelationId,
} from 'typeorm';
import { ProductType } from '../classifiers/productType.entity';
import { UnitMeasurament } from '../unitMeasurament/unitMeasurament.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn({
    name: 'nProductId',
  })
  id: number;
  @Column({
    name: 'sName',
    length: 100,
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
    type: 'boolean',
  })
  isActive: boolean;

  @RelationId((product: Product) => product.type)
  typeId: number;

  @RelationId((product: Product) => product.unitMeasurament)
  unitMeasuramentId: number;

  @ManyToOne(() => ProductType)
  @JoinColumn({ name: 'nTypeId' })
  type: ProductType;

  @ManyToOne(() => UnitMeasurament)
  @JoinColumn({ name: 'nUnitMeasuramentId' })
  unitMeasurament: UnitMeasurament;
}
