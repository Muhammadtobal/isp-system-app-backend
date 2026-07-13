import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';

@Entity('radusergroup')
export class RadUserGroup {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({
    type: 'varchar',
    length: 255,
  })
  username: string;

  @Index()
  @Column({
    type: 'varchar',
    length: 255,
  })
  groupname: string;

  @Column({
    type: 'int',
    default: 1,
  })
  priority: number;
}
