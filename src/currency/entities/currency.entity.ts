import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';

import { Expense } from 'src/expense/entities/expense.entity';
import { ExchangeRate } from './exchange_rate.entity';
import { Product } from 'src/product/entities/product.entity';
import { BaseEntity } from 'src/shared/base.entity';
import { Payment } from 'src/payment/entities/payment.entity';
import { Sold } from 'src/sold/entities/sold.entity';
import { Plan } from 'src/plan/entities/plan.entity';

@Entity()
export class Currency {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255 })
  code: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @OneToMany(() => ExchangeRate, (exchange_rate) => exchange_rate.to_currency)
  exchangeRatesTo: ExchangeRate[];

  @OneToMany(() => ExchangeRate, (exchange_rate) => exchange_rate.currency)
  exchangeRatesFrom: ExchangeRate[];

  @OneToMany(() => Expense, (expense) => expense.currency)
  expenses: Expense[];

  @OneToMany(() => Payment, (payment) => payment.currency)
  payments: Payment[];

  @OneToMany(() => Sold, (sold) => sold.currency)
  sales: Sold[];

  @OneToMany(() => Plan, (plan) => plan.currency)
  plans: Plan[];

  @OneToMany(() => Product, (product) => product.currency)
  products: Product[];
}
