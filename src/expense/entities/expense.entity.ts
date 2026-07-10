import { Employee } from 'src/employee/entities/employee.entity';
import { ExpenseType } from 'src/expense_type/entities/expense_type.entity';
import { Network } from 'src/network/entities/network.entity';
import { BaseEntity } from 'src/shared/base.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';

@Entity()
export class Expense extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'double precision' })
  value: number;

  @Column('bigint')
  expense_type_id: number;

  @Column('bigint')
  network_id: number;

  @Column('bigint', { nullable: true })
  employee_id?: number;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column('bigint', { nullable: true })
  user_id?: number;

  @ManyToOne(() => User, (user) => user.expenses)
  @JoinColumn({ name: 'user_id' })
  user?: User;

  @ManyToOne(() => ExpenseType, (expense_type) => expense_type.expenses)
  @JoinColumn({ name: 'expense_type_id' })
  expense_type?: ExpenseType;

  @ManyToOne(() => Network, (network) => network.expenses)
  @JoinColumn({ name: 'network_id' })
  network?: Network;

  @ManyToOne(() => Employee, (employee) => employee.expenses)
  @JoinColumn({ name: 'employee_id' })
  employee?: Employee;
}
