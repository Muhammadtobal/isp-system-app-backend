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
import { User } from 'src/user/entities/user.entity';
import { Currency } from 'src/currency/entities/currency.entity';

@Entity()
export class Payment extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column('bigint')
  subscription_id: number;

  @Column({ type: 'double' })
  amount: number;

  @Column('bigint', { nullable: true })
  user_id?: number;

  @Column({ type: 'double precision', nullable: true })
  value_converted?: number;

  @Column('bigint')
  network_id: number;

  @Column('bigint')
  currency_id: number;

  @ManyToOne(() => Currency, (currency) => currency.payments)
  @JoinColumn({ name: 'currency_id' })
  currency?: Currency;

  @ManyToOne(() => User, (user) => user.payments)
  @JoinColumn({ name: 'user_id' })
  user?: User;

  @ManyToOne(() => Network, (user) => user.payments)
  @JoinColumn({ name: 'network_id' })
  network?: Network;

  @ManyToOne(() => Subscription, (subscription) => subscription.payments, {})
  @JoinColumn({ name: 'subscription_id' })
  subscription?: Subscription;
}
