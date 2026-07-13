import { Network } from 'src/network/entities/network.entity';
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
export class NetworkRadius {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'varchar', length: 255 })
  username: string;

  @Column('bigint')
  network_id: number;

  @ManyToOne(() => Network, (network) => network.network_radiuses)
  @JoinColumn({ name: 'network_id' })
  network?: Network;
}
