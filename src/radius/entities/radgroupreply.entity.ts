import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';

@Entity('radgroupreply')
export class RadGroupReply {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({ length: 64 })
  groupname: string;

  @Column({ length: 64 })
  attribute: string;

  @Column({
    type: 'char',
    length: 2,
    default: ':=',
  })
  op: string;

  @Column({ length: 253 })
  value: string;
}
