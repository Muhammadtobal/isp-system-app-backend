import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { HotspotProfile } from './hotspot-profile.entity';

@Entity()
export class HotspotVoucher {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({
    type: 'varchar',
    length: 255,

    unique: true,
  })
  code: string;

  @Column({
    type: 'varchar',
    length: 255,
    unique: true,
  })
  username: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({ type: 'bigint' })
  profile_id: number;

  @ManyToOne(() => HotspotProfile, (profile) => profile.vouchers)
  @JoinColumn({
    name: 'profile_id',
  })
  profile: HotspotProfile;

  @Column({
    default: 'NEW',
  })
  status: string;

  @Column({
    nullable: true,
  })
  activated_at: Date;

  @Column({
    nullable: true,
  })
  expire_at: Date;
}
