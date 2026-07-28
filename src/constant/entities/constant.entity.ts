import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity()
export class Constant {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: string;

  @Column('varchar', { length: 255 })
  key: string;

  @Column('simple-json')
  value: Record<string, any>;

  @Column('boolean', { default: true })
  expose: boolean;
}
