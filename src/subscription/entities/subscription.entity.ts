import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  BeforeInsert,
} from 'typeorm';

import { Customer } from 'src/customer/entities/customer.entity';
import { Plan } from 'src/plan/entities/plan.entity';
import { Network } from 'src/network/entities/network.entity';
import { Payment } from 'src/payment/entities/payment.entity';
import { BaseEntity } from 'src/shared/base.entity';
import { Point } from 'src/point/entities/point.entity';
import { Exclude } from 'class-transformer';
import { User } from 'src/user/entities/user.entity';
import { Alert } from 'src/alert/entities/alert.entity';
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

  @Column({ type: 'boolean', default: true })
  status: boolean;

  @Column('bigint', { nullable: true })
  user_id?: number;

  @Column({ unique: true })
  subscription_code: string;

  @ManyToOne(() => User, (user) => user.expenses)
  @JoinColumn({ name: 'user_id' })
  user?: User;

  @ManyToOne(() => Plan, (plan) => plan.subscriptions)
  @JoinColumn({ name: 'plan_id' })
  plan?: Plan;

  @ManyToOne(() => Customer, (customer) => customer.subscriptions, {
    onDelete: 'CASCADE',
    cascade: true,
  })
  @JoinColumn({ name: 'customer_id' })
  customer?: Customer;

  @ManyToOne(() => Point, (point) => point.subscriptions)
  @JoinColumn({ name: 'point_id' })
  point?: Point;

  @OneToMany(() => Payment, (payment) => payment.subscription)
  payments: Payment[];

  @OneToMany(() => Alert, (alert) => alert.subscription)
  alerts: Alert[];

  @BeforeInsert()
  generateSubscriptionCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    this.subscription_code = `sub-${code}`;
  }
}
