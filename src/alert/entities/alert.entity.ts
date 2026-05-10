import { Customer } from 'src/customer/entities/customer.entity';
import { EmployeeNetwork } from 'src/employee-network/entities/employee-network.entity';
import { Employee } from 'src/employee/entities/employee.entity';
import { Expense } from 'src/expense/entities/expense.entity';
import { Plan } from 'src/plan/entities/plan.entity';
import { Point } from 'src/point/entities/point.entity';
import { BaseEntity } from 'src/shared/base.entity';
import { Subscription } from 'src/subscription/entities/subscription.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Alert extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column('bigint')
  subscription_id: number;

  @Column('bigint')
  user_id: number;

  @ManyToOne(() => Subscription, (subscription) => subscription.alerts)
  @JoinColumn({ name: 'subscription_id' })
  subscription?: Subscription;

  @ManyToOne(() => User, (user) => user.alerts)
  @JoinColumn({ name: 'user_id' })
  user?: User;
}
