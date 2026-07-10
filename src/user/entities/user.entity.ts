import { Alert } from 'src/alert/entities/alert.entity';
import { Customer } from 'src/customer/entities/customer.entity';
import { Domain } from 'src/domain/entities/domain.entity';
import { EmployeeNetwork } from 'src/employee-network/entities/employee-network.entity';
import { Employee } from 'src/employee/entities/employee.entity';
import { EmployeePermission } from 'src/employee_permission/entities/employee_permission.entity';
import { Expense } from 'src/expense/entities/expense.entity';
import { ExpenseType } from 'src/expense_type/entities/expense_type.entity';
import { Network } from 'src/network/entities/network.entity';
import { Payment } from 'src/payment/entities/payment.entity';
import { Point } from 'src/point/entities/point.entity';
import { Product } from 'src/product/entities/product.entity';
import { BaseEntity } from 'src/shared/base.entity';
import { Role } from 'src/shared/enums/role.enum';
import { Sold } from 'src/sold/entities/sold.entity';
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

  @Column({ type: 'text', nullable: true })
  logo?: string;

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

  @Column('varchar', { length: 255, nullable: true })
  resetPasswordToken?: string | null;

  @Column({ type: 'timestamp', nullable: true })
  resetPasswordExpires?: Date | null;

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

  @OneToMany(() => Alert, (alert) => alert.user)
  alerts: Alert[];

  @OneToMany(() => EmployeeNetwork, (employee_network) => employee_network.user)
  employee_networks: EmployeeNetwork[];

  @OneToMany(() => Employee, (employee) => employee.user)
  employees: Employee[];

  @OneToMany(() => ExpenseType, (expense_type) => expense_type.user)
  expense_types: ExpenseType[];

  @OneToMany(() => Product, (product) => product.user)
  products: Product[];

  @OneToMany(() => Sold, (sold) => sold.user)
  sales: Sold[];

  @OneToMany(() => Domain, (domain) => domain.user)
  domains: Domain[];

  @OneToMany(
    () => EmployeePermission,
    (employee_permission) => employee_permission.user,
  )
  employee_permissions: EmployeePermission[];
}
