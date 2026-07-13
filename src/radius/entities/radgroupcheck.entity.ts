import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';

@Entity('radgroupcheck')
export class RadGroupCheck {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({
    type: 'varchar',
    length: 255,
  })
  groupname: string;

  @Column({
    type: 'varchar',
    length: 255,
  })
  attribute: string;

  @Column({
    type: 'varchar',
    length: 255,
    default: ':=',
  })
  op: string;

  @Column({
    type: 'varchar',
    length: 255,
  })
  value: string;
}
