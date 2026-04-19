import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { Customer } from 'src/customer/entities/customer.entity';
import { Network } from 'src/network/entities/network.entity';
import { Plan } from 'src/plan/entities/plan.entity';
import { Subscription } from 'src/subscription/entities/subscription.entity';
import { BaseEntity } from 'src/shared/base.entity';

@Entity()
export class Payment extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column('bigint')
  subscription_id: number;

  @Column({ type: 'decimal' })
  amount: number;

  @ManyToOne(() => Subscription, (subscription) => subscription.payments)
  @JoinColumn({ name: 'subscription_id' })
  subscription?: Subscription;
}
