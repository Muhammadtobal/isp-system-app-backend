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
@Entity()
export class EmployeePermission extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column('bigint')
  employee_id: number;

  @Column('bigint')
  permission_id: number;

  @ManyToOne(() => Employee, (employee) => employee.employee_permissions)
  @JoinColumn({ name: 'employee_id' })
  employee?: Employee;

  @ManyToOne(() => Permission, (permission) => permission.employee_permissions)
  @JoinColumn({ name: 'permission_id' })
  permission?: Permission;
}
