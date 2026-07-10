import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Network } from 'src/network/entities/network.entity';
import { Subscription } from 'src/subscription/entities/subscription.entity';
import { BaseEntity } from 'src/shared/base.entity';
import { User } from 'src/user/entities/user.entity';
import { Sold } from 'src/sold/entities/sold.entity';

@Entity()
export class Product extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'double' })
  price: number;

  @Column('bigint', { nullable: true })
  user_id?: number;

  @ManyToOne(() => User, (user) => user.products)
  @JoinColumn({ name: 'user_id' })
  user?: User;

  @OneToMany(() => Sold, (sold) => sold.product)
  sales: Sold[];
}
