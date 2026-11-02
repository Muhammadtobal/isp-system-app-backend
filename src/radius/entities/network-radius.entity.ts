import { Network } from 'src/network/entities/network.entity';
import { ServiceType } from 'src/shared/enums/service_type.enum';
import { User } from 'src/user/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Index,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

@Entity()
@Index('UQ_network_radius_username', ['username'], { unique: true })
export class NetworkRadius {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'varchar', length: 255 })
  username: string;

  @Column('bigint')
  network_id: number;

  @Column({ type: 'enum', enum: ServiceType })
  service_type: ServiceType;

  @ManyToOne(() => Network, (network) => network.network_radiuses)
  @JoinColumn({ name: 'network_id' })
  network?: Network;
}
