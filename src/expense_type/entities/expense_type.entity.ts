import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';

import { Expense } from 'src/expense/entities/expense.entity';
import { BaseEntity } from 'src/shared/base.entity';

@Entity()
export class ExpenseType extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @OneToMany(() => Expense, (expense) => expense.expense_type)
  expenses: Expense[];
}
