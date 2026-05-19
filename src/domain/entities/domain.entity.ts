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
import { User } from 'src/user/entities/user.entity';

@Entity()
export class Domain extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column('bigint')
  user_id: number;

  @ManyToOne(() => User, (user) => user.domains)
  @JoinColumn({ name: 'user_id' })
  user?: User;
}
