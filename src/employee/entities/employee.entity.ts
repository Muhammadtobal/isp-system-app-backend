import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { EmployeePermission } from 'src/employee_permission/entities/employee_permission.entity';
import { BaseEntity } from 'src/shared/base.entity';
import { Expense } from 'src/expense/entities/expense.entity';
import { Network } from 'src/network/entities/network.entity';
import { User } from 'src/user/entities/user.entity';
import { EmployeeNetwork } from 'src/employee-network/entities/employee-network.entity';

@Entity()
export class Employee extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column('varchar', { length: 255, unique: true })
  email: string;

  @Column('varchar', { length: 255 })
  full_name: string;

  @Column('varchar', { length: 255 })
  password: string;

  @Column('bigint', { nullable: true })
  user_id?: number;

  @ManyToOne(() => User, (user) => user.employees)
  @JoinColumn({ name: 'user_id' })
  user?: User;

  @OneToMany(
    () => EmployeePermission,
    (employee_permission) => employee_permission.employee,
  )
  employee_permissions: EmployeePermission[];

  @OneToMany(() => Expense, (expense) => expense.employee)
  expenses: Expense[];

  @OneToMany(
    () => EmployeeNetwork,
    (employee_network) => employee_network.employee,
  )
  employee_networks: EmployeeNetwork[];
}
