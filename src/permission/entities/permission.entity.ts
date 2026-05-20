import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { EmployeePermission } from 'src/employee_permission/entities/employee_permission.entity';
import { BaseEntity } from 'src/shared/base.entity';

@Entity()
export class Permission extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column('varchar', { length: 255 })
  name: string;

  @Column('text', { nullable: true })
  description?: string;

  @Column({ type: 'boolean', default: true })
  visual_for_user: boolean;

  @Column('text', { nullable: true })
  translation?: string;

  @OneToMany(
    () => EmployeePermission,
    (employeePermission) => employeePermission.permission,
  )
  employee_permissions: EmployeePermission[];
}
