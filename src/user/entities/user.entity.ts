import { Customer } from 'src/customer/entities/customer.entity';
import { EmployeeNetwork } from 'src/employee-network/entities/employee-network.entity';
import { Employee } from 'src/employee/entities/employee.entity';
import { EmployeePermission } from 'src/employee_permission/entities/employee_permission.entity';
import { Expense } from 'src/expense/entities/expense.entity';
import { Network } from 'src/network/entities/network.entity';
import { Payment } from 'src/payment/entities/payment.entity';
import { Point } from 'src/point/entities/point.entity';
import { BaseEntity } from 'src/shared/base.entity';
import { Role } from 'src/shared/enums/role.enum';
import { Subscription } from 'src/subscription/entities/subscription.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255 })
  description: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({ type: 'varchar', length: 255 })
  phone: string;

  @Column({ type: 'text' })
  address: string;

  @Column({
    type: 'enum',
    enum: Role,
  })
  role: Role;

  @OneToMany(() => Network, (network) => network.user)
  networks: Network[];

  @OneToMany(() => Customer, (customer) => customer.user)
  customers: Customer[];

  @OneToMany(() => Expense, (expense) => expense.user)
  expenses: Expense[];

  @OneToMany(() => Payment, (payment) => payment.user)
  payments: Payment[];

  @OneToMany(() => Point, (point) => point.user)
  points: Point[];

  @OneToMany(() => Subscription, (subscription) => subscription.user)
  subscriptions: Subscription[];

  @OneToMany(() => EmployeeNetwork, (employee_network) => employee_network.user)
  employee_networks: EmployeeNetwork[];

  @OneToMany(() => Employee, (employee) => employee.user)
  employees: Employee[];

  @OneToMany(
    () => EmployeePermission,
    (employee_permission) => employee_permission.user,
  )
  employee_permissions: EmployeePermission[];
}
