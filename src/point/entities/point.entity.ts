import { Employee } from 'src/employee/entities/employee.entity';
import { ExpenseType } from 'src/expense_type/entities/expense_type.entity';
import { Network } from 'src/network/entities/network.entity';
import { BaseEntity } from 'src/shared/base.entity';
import { Subscription } from 'src/subscription/entities/subscription.entity';
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
export class Point extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column('bigint')
  network_id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'int' })
  max_subscription: number;

  @Column({ type: 'int', default: 0 })
  count_subscription: number;

  @Column({ type: 'text' })
  location: string;

  @Column('bigint', { nullable: true })
  user_id?: number;

  @ManyToOne(() => User, (user) => user.expenses)
  @JoinColumn({ name: 'user_id' })
  user?: User;

  @ManyToOne(() => Network, (network) => network.points)
  @JoinColumn({ name: 'network_id' })
  network?: Network;

  @OneToMany(() => Subscription, (subscription) => subscription.point)
  subscriptions: Subscription[];
}
