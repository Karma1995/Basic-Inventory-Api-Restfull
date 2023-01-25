import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UnitMeasurament {
  @PrimaryGeneratedColumn({
    name: 'nUnitMeasuramentId',
  })
  id: number;
  @Column({
    name: 'sDescription',
  })
  description: string;
  @Column({
    name: 'sName',
  })
  name: string;
  @Column({
    name: 'sSimbol',
  })
  simbol: string;
}
