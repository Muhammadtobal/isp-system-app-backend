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
import { ProductType } from 'src/product_type/entities/product_type.entity';

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

  @Column('bigint')
  product_type_id?: number;

  @ManyToOne(() => User, (user) => user.products)
  @JoinColumn({ name: 'user_id' })
  user?: User;

  @ManyToOne(() => ProductType, (product_type) => product_type.products)
  @JoinColumn({ name: 'product_type_id' })
  product_type?: ProductType;
}
