import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  BeforeInsert,
} from 'typeorm';

import { Network } from 'src/network/entities/network.entity';
import { BaseEntity } from 'src/shared/base.entity';

@Entity()
export class Template extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column('bigint')
  network_id: number;

  @Column({ type: 'json' })
  config: Record<string, any>;

  @ManyToOne(() => Network, (network) => network.templates)
  @JoinColumn({ name: 'network_id' })
  network?: Network;
}
