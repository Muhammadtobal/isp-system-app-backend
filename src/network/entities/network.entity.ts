import { Customer } from 'src/customer/entities/customer.entity';
import { Plan } from 'src/plan/entities/plan.entity';
import { BaseEntity } from 'src/shared/base.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Network extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255 })
  location: string;

  @OneToMany(() => Customer, (customer) => customer.network)
  customers: Customer[];

  @OneToMany(() => Plan, (plan) => plan.network)
  plans: Plan[];
}
