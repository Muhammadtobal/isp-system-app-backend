import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('nas')
export class Nas {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 255,
  })
  nasname: string;

  @Column({
    type: 'varchar',
    length: 255,
  })
  shortname: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    default: 'other',
  })
  type: string;

  @Column({
    nullable: true,
  })
  ports: number;

  @Column({
    type: 'varchar',
    length: 255,
    default: 'secret',
  })
  secret: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  server: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  community: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  description: string;
}
