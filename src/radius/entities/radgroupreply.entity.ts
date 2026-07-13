import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';

@Entity('radgroupreply')
export class RadGroupReply {
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
    type: 'char',
    length: 2,
    default: ':=',
  })
  op: string;

  @Column({
    type: 'varchar',
    length: 255,
  })
  value: string;
}
