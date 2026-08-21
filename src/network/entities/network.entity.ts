import { Customer } from 'src/customer/entities/customer.entity';
import { EmployeeNetwork } from 'src/employee-network/entities/employee-network.entity';
import { Employee } from 'src/employee/entities/employee.entity';
import { Expense } from 'src/expense/entities/expense.entity';
import { Payment } from 'src/payment/entities/payment.entity';
import { Plan } from 'src/plan/entities/plan.entity';
import { Point } from 'src/point/entities/point.entity';
import { GroupNetworkRadius } from 'src/radius/entities/group-network-radius';
import { NetworkRadius } from 'src/radius/entities/network-radius.entity';
import { BaseEntity } from 'src/shared/base.entity';
import { Subscription } from 'src/subscription/entities/subscription.entity';
import { Template } from 'src/template/entities/template.entity';
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

  @OneToMany(
    () => EmployeeNetwork,
    (employee_network) => employee_network.network,
  )
  employee_networks: EmployeeNetwork[];

  @OneToMany(() => Payment, (payment) => payment.network)
  payments: Payment[];

  @OneToMany(() => Subscription, (subscription) => subscription.network)
  subscriptions: Subscription[];

  @OneToMany(() => NetworkRadius, (network_radius) => network_radius.network)
  network_radiuses: NetworkRadius[];

  @OneToMany(() => Template, (template) => template.network)
  templates: Template[];

  @OneToMany(
    () => GroupNetworkRadius,
    (group_network_radius) => group_network_radius.network,
  )
  group_network_radiuses: GroupNetworkRadius[];
}
