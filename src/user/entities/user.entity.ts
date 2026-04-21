import { Network } from 'src/network/entities/network.entity';
import { BaseEntity } from 'src/shared/base.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255 })
  description: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({ type: 'varchar', length: 255 })
  phone: string;

  @Column('varchar', { length: 255, nullable: true })
  refresh_token?: string;

  @Column({ type: 'text' })
  address: string;

  @OneToMany(() => Network, (network) => network.user)
  networks: Network[];
}
