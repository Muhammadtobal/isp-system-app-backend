import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('nas')
export class Nas {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 128 })
  nasname: string;

  @Column({
    length: 32,
    nullable: true,
  })
  shortname: string;

  @Column({
    length: 30,
    nullable: true,
    default: 'other',
  })
  type: string;

  @Column({
    nullable: true,
  })
  ports: number;

  @Column({
    length: 60,
    default: 'secret',
  })
  secret: string;

  @Column({
    length: 64,
    nullable: true,
  })
  server: string;

  @Column({
    length: 50,
    nullable: true,
  })
  community: string;

  @Column({
    length: 200,
    nullable: true,
  })
  description: string;
}
