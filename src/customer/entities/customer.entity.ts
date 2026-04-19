import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Network } from 'src/network/entities/network.entity';
import { Subscription } from 'src/subscription/entities/subscription.entity';
import { BaseEntity } from 'src/shared/base.entity';

@Entity()
export class Customer extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255 })
  phone: string;

  @Column('bigint')
  network_id: number;

  @ManyToOne(() => Network, (network) => network.customers)
  @JoinColumn({ name: 'network_id' })
  network?: Network;

  @OneToMany(() => Subscription, (subscription) => subscription.customer)
  subscriptions: Subscription[];
}
