import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

import { HotspotVoucher } from './hotspot-voucher.entity';
import { User } from 'src/user/entities/user.entity';

@Entity()
export class HotspotProfile {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column('bigint', { nullable: true })
  user_id?: number;

  // download Mbps
  @Column({ type: 'int' })
  download_speed: number;

  @Column({ type: 'int' })
  upload_speed: number;

  @Column({
    type: 'int',
    nullable: true,
  })
  session_time: number;

  @Column({
    type: 'int',
    nullable: true,
  })
  quota_mb: number;

  @Column({
    type: 'double',
  })
  price: number;

  @Column({
    type: 'boolean',
    default: true,
  })
  active: boolean;

  @OneToMany(() => HotspotVoucher, (voucher) => voucher.profile)
  vouchers: HotspotVoucher[];

  @ManyToOne(() => User, (user) => user.networks)
  @JoinColumn({ name: 'user_id' })
  user?: User;
}
