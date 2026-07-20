import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('nas')
export class Nas {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({
    type: 'varchar',
    length: 255,
  })
  nasname: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  shortname?: string;

  @Column({
    type: 'varchar',
    length: 50,
    default: 'other',
  })
  type: string;

  @Column({
    type: 'int',
    nullable: true,
  })
  ports?: number;

  @Column({
    type: 'varchar',
    length: 255,
  })
  secret: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  server?: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  community?: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  description?: string;
}
