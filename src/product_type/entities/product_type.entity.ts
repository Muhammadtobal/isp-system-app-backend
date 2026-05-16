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
import { Product } from 'src/product/entities/product.entity';

@Entity()
export class ProductType extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @OneToMany(() => Product, (product) => product.product_type)
  products: Product[];
}
