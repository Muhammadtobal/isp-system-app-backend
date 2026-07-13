import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';

@Entity('radacct')
export class RadAcct {
  @PrimaryGeneratedColumn()
  radacctid: number;

  @Column({
    type: 'varchar',
    length: 255,
  })
  acctsessionid: string;

  @Column({
    type: 'varchar',
    length: 255,
  })
  acctuniqueid: string;

  @Index()
  @Column({
    type: 'varchar',
    length: 255,
  })
  username: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  realm: string;

  @Column({
    type: 'varchar',
    length: 255,
  })
  nasipaddress: string;

  @Column({
    type: 'datetime',
    nullable: true,
  })
  acctstarttime: Date;

  @Column({
    type: 'datetime',
    nullable: true,
  })
  acctupdatetime: Date;

  @Column({
    type: 'datetime',
    nullable: true,
  })
  acctstoptime: Date;

  @Column({
    type: 'int',
    nullable: true,
  })
  acctsessiontime: number;

  @Column({
    type: 'bigint',
    nullable: true,
  })
  acctinputoctets: number;

  @Column({
    type: 'bigint',
    nullable: true,
  })
  acctoutputoctets: number;

  @Column({
    type: 'varchar',
    length: 255,
  })
  framedipaddress: string;

  @Column({
    type: 'varchar',
    length: 255,
  })
  callingstationid: string;

  @Column({
    type: 'varchar',
    length: 255,
  })
  calledstationid: string;
}
