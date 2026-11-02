import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';

@Entity('radreply')
@Index('IDX_radreply_username', ['username'])
export class RadReply {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  username: string;

  @Column({ length: 255 })
  attribute: string;

  @Column({ type: 'char', length: 2, default: '=' })
  op: string;

  @Column({ length: 255 })
  value: string;
}
