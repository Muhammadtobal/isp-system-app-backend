import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('radpostauth')
export class RadPostAuth {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 64 })
  username: string;

  @Column({ length: 64 })
  pass: string;

  @Column({ length: 32 })
  reply: string;

  @Column({
    type: 'timestamp',
    precision: 6,
  })
  authdate: Date;

  @Column({
    nullable: true,
    length: 64,
  })
  class: string;
}
