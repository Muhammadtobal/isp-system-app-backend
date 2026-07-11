import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';

@Entity('radusergroup')
export class RadUserGroup {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({ length: 64 })
  username: string;

  @Index()
  @Column({ length: 64 })
  groupname: string;

  @Column({
    default: 1,
  })
  priority: number;
}
