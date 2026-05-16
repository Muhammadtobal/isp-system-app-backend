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
import { Product } from 'src/product/entities/product.entity';

@Entity()
export class Sold extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'double' })
  amount: number;

  @Column({ type: 'double' })
  value: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  unit?: string;

  @Column('bigint')
  product_id: number;

  @Column('bigint', { nullable: true })
  user_id?: number;

  @ManyToOne(() => User, (user) => user.sales)
  @JoinColumn({ name: 'user_id' })
  user?: User;

  @ManyToOne(() => Product, (product) => product.sales)
  @JoinColumn({ name: 'product_id' })
  product?: Product;
}
