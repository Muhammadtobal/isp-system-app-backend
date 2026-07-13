import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('radpostauth')
export class RadPostAuth {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 255,
  })
  username: string;

  @Column({
    type: 'varchar',
    length: 255,
  })
  pass: string;

  @Column({
    type: 'varchar',
    length: 255,
  })
  reply: string;

  @Column({
    type: 'timestamp',
    precision: 6,
  })
  authdate: Date;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  class: string;
}
