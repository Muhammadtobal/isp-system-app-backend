import { Customer } from 'src/customer/entities/customer.entity';
import { Employee } from 'src/employee/entities/employee.entity';
import { Expense } from 'src/expense/entities/expense.entity';
import { Plan } from 'src/plan/entities/plan.entity';
import { Point } from 'src/point/entities/point.entity';
import { BaseEntity } from 'src/shared/base.entity';
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
export class Network extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text' })
  location: string;

  @Column('bigint')
  user_id: number;

  @ManyToOne(() => User, (user) => user.networks)
  @JoinColumn({ name: 'user_id' })
  user?: User;

  @OneToMany(() => Customer, (customer) => customer.network)
  customers: Customer[];

  @OneToMany(() => Plan, (plan) => plan.network)
  plans: Plan[];

  @OneToMany(() => Point, (point) => point.network)
  points: Point[];

  @OneToMany(() => Expense, (expense) => expense.network)
  expenses: Expense[];

  @OneToMany(() => Employee, (employee) => employee.network)
  employees: Employee[];
}
