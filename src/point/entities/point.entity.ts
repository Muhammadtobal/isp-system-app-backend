import { Employee } from 'src/employee/entities/employee.entity';
import { ExpenseType } from 'src/expense_type/entities/expense_type.entity';
import { Network } from 'src/network/entities/network.entity';
import { BaseEntity } from 'src/shared/base.entity';
import { Subscription } from 'src/subscription/entities/subscription.entity';
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

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @ManyToOne(() => Network, (network) => network.points)
  @JoinColumn({ name: 'network_id' })
  network?: Network;

  @OneToMany(() => Subscription, (subscription) => subscription.point)
  subscriptions: Subscription[];
}
