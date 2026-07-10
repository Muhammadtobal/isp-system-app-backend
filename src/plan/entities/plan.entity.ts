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
import { ServiceType } from 'src/shared/enums/service_type.enum';

@Entity()
export class Plan extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'double' })
  price: number;

  @Column('bigint')
  network_id: number;

  @Column('bigint', { nullable: true })
  user_id?: number;

  // نوع الخدمة
  @Column({
    type: 'enum',
    enum: ServiceType,
  })
  service_type: ServiceType;

  // سرعة التحميل kbps
  @Column('int')
  download_speed: number;

  // سرعة الرفع kbps
  @Column('int')
  upload_speed: number;

  // حجم البيانات بالميغابايت (NULL = Unlimited)
  @Column('bigint', { nullable: true })
  quota_mb?: number;

  // مدة الجلسة بالثواني (خاصة بالـ Hotspot غالباً)
  @Column('int', { nullable: true })
  session_timeout?: number;

  // مدة الاشتراك بالأيام
  @Column('int', { nullable: true })
  validity_days?: number;

  // عدد الأجهزة المسموح بها
  @Column('int', { default: 1 })
  simultaneous_use: number;

  @ManyToOne(() => User, (user) => user.expenses)
  @JoinColumn({ name: 'user_id' })
  user?: User;

  @ManyToOne(() => Network, (network) => network.plans)
  @JoinColumn({ name: 'network_id' })
  network?: Network;

  @OneToMany(() => Subscription, (subscription) => subscription.plan)
  subscriptions: Subscription[];
}
