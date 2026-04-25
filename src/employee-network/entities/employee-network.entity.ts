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
import { Employee } from 'src/employee/entities/employee.entity';

@Entity()
export class EmployeeNetwork extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column('bigint')
  network_id: number;

  @Column('bigint')
  employee_id: number;

  @Column('bigint', { nullable: true })
  user_id?: number;

  @ManyToOne(() => User, (user) => user.employee_networks)
  @JoinColumn({ name: 'user_id' })
  user?: User;

  @ManyToOne(() => Network, (network) => network.employee_networks)
  @JoinColumn({ name: 'network_id' })
  network?: Network;

  @ManyToOne(() => Employee, (employee) => employee.employee_networks)
  @JoinColumn({ name: 'employee_id' })
  employee?: Employee;
}
