import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';

@Entity('radusergroup')
export class RadUserGroup {
  @PrimaryGeneratedColumn()
  id: number;

  @Index('IDX_radusergroup_username')
  @Column({
    type: 'varchar',
    length: 255,
  })
  username: string;

  @Index('IDX_radusergroup_groupname')
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
