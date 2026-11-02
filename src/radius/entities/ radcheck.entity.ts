import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';

@Entity('radcheck')
@Index('IDX_radcheck_username', ['username'])
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
