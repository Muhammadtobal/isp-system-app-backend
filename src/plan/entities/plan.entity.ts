import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Network } from 'src/network/entities/network.entity';
import { Subscription } from 'src/subscription/entities/subscription.entity';
import { BaseEntity } from 'src/shared/base.entity';

@Entity()
export class Plan extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'int' })
  speed: number;

  @Column({ type: 'decimal' })
  price: number;

  @Column('bigint')
  network_id: number;

  @ManyToOne(() => Network, (network) => network.plans)
  @JoinColumn({ name: 'network_id' })
  network?: Network;

  @OneToMany(() => Subscription, (subscription) => subscription.plan)
  subscriptions: Subscription[];
}
