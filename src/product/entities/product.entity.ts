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
import { Currency } from 'src/currency/entities/currency.entity';

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

  @Column({ type: 'double precision', nullable: true })
  value_converted?: number;

  @Column('bigint')
  currency_id: number;

  @ManyToOne(() => Currency, (currency) => currency.products)
  @JoinColumn({ name: 'currency_id' })
  currency?: Currency;

  @ManyToOne(() => User, (user) => user.products)
  @JoinColumn({ name: 'user_id' })
  user?: User;

  @OneToMany(() => Sold, (sold) => sold.product)
  sales: Sold[];
}
