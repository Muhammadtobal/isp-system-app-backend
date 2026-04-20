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

  @Column({ type: 'date' })
  start_date: string;

  @Column({ type: 'date' })
  end_date: string;

  @Column({ type: 'varchar', length: 50 })
  status: string;

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
