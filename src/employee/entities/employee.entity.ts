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

@Entity()
export class Employee extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column('varchar', { length: 255 })
  email: string;

  @Column('varchar', { length: 255 })
  full_name: string;

  @Column('bigint')
  network_id: number;

  @Column('varchar', { length: 255 })
  password: string;

  @Column('varchar', { length: 255, nullable: true })
  refresh_token?: string;

  @OneToMany(
    () => EmployeePermission,
    (employee_permission) => employee_permission.employee,
  )
  employee_permissions: EmployeePermission[];

  @OneToMany(() => Expense, (expense) => expense.employee)
  expenses: Expense[];

  @ManyToOne(() => Network, (network) => network.employees)
  @JoinColumn({ name: 'network_id' })
  network?: Network;
}
