import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Currency } from 'src/currency/entities/currency.entity';
import { BaseEntity } from 'src/shared/base.entity';

@Entity()
export class ExchangeRate {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column('bigint')
  currency_id: number;

  @Column('bigint')
  to_currency_id: number;

  @Column('double precision', { default: 1 })
  rate: number;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @ManyToOne(() => Currency, (currency) => currency.exchangeRatesFrom, {
    nullable: false,
  })
  @JoinColumn({ name: 'currency_id' })
  currency: Currency;

  @ManyToOne(() => Currency, (currency) => currency.exchangeRatesTo, {
    nullable: false,
  })
  @JoinColumn({ name: 'to_currency_id' })
  to_currency: Currency;
}
