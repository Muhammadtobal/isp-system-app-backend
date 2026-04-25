import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

import { Customer } from 'src/customer/entities/customer.entity';
import { Plan } from 'src/plan/entities/plan.entity';
import { Network } from 'src/network/entities/network.entity';
import { Payment } from 'src/payment/entities/payment.entity';
import { BaseEntity } from 'src/shared/base.entity';
import { Point } from 'src/point/entities/point.entity';
import { Exclude } from 'class-transformer';
import { User } from 'src/user/entities/user.entity';
@Entity()
export class Subscription extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column('bigint')
  plan_id: number;

  @Column('bigint')
  customer_id: number;

  @Column('bigint')
  point_id: number;

  @Column({ type: 'date', nullable: true })
  end_date?: string;

  @Column({ type: 'boolean', default: true })
  status: boolean;

  @Column('bigint', { nullable: true })
  user_id?: number;

  @ManyToOne(() => User, (user) => user.expenses)
  @JoinColumn({ name: 'user_id' })
  user?: User;

  @ManyToOne(() => Plan, (plan) => plan.subscriptions)
  @JoinColumn({ name: 'plan_id' })
  plan?: Plan;

  @ManyToOne(() => Customer, (customer) => customer.subscriptions)
  @JoinColumn({ name: 'customer_id' })
  customer?: Customer;

  @ManyToOne(() => Point, (point) => point.subscriptions)
  @JoinColumn({ name: 'point_id' })
  point?: Point;

  @OneToMany(() => Payment, (payment) => payment.subscription)
  payments: Payment[];
}
