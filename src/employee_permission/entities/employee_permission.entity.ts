import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Employee } from 'src/employee/entities/employee.entity';
import { Permission } from 'src/permission/entities/permission.entity';
import { BaseEntity } from 'src/shared/base.entity';
import { User } from 'src/user/entities/user.entity';
@Entity()
export class EmployeePermission extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column('bigint')
  employee_id: number;

  @Column('bigint')
  permission_id: number;

  @Column('bigint', { nullable: true })
  user_id?: number;

  @ManyToOne(() => Employee, (employee) => employee.employee_permissions)
  @JoinColumn({ name: 'employee_id' })
  employee?: Employee;

  User;
  @ManyToOne(() => User, (user) => user.employee_permissions)
  @JoinColumn({ name: 'user_id' })
  user?: User;

  @ManyToOne(() => Permission, (permission) => permission.employee_permissions)
  @JoinColumn({ name: 'permission_id' })
  permission?: Permission;
}
