import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';

@Entity('radcheck')
export class RadCheck {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  username: string;

  @Column({ type: 'varchar', length: 255 })
  attribute: string;

  @Column({ type: 'char', length: 2, default: '==' })
  op: string;

  @Column({ type: 'varchar', length: 255 })
  value: string;
}
