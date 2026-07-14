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
export class GroupNetworkRadius {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'varchar', length: 255 })
  groupname: string;

  @Column('bigint')
  network_id: number;

  @ManyToOne(() => Network, (network) => network.group_network_radiuses)
  @JoinColumn({ name: 'network_id' })
  network?: Network;
}
