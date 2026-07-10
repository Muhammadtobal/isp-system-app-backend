import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';

@Entity('radcheck')
export class RadCheck {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({ length: 64 })
  username: string;

  @Column({ length: 64 })
  attribute: string;

  @Column({ type: 'char', length: 2, default: '==' })
  op: string;

  @Column({ length: 253 })
  value: string;
}
