import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';

@Entity('radacct')
export class RadAcct {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    unsigned: false,
  })
  radacctid: number;

  @Index()
  @Column({
    type: 'varchar',
    length: 255,
  })
  acctsessionid: string;

  @Column({
    type: 'varchar',
    length: 255,
    unique: true,
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
  realm: string | null;

  @Index()
  @Column({
    type: 'varchar',
    length: 255,
  })
  nasipaddress: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  nasportid: string | null;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  nasporttype: string | null;

  @Index()
  @Column({
    type: 'datetime',
    nullable: true,
  })
  acctstarttime: Date | null;

  @Column({
    type: 'datetime',
    nullable: true,
  })
  acctupdatetime: Date | null;

  @Index()
  @Column({
    type: 'datetime',
    nullable: true,
  })
  acctstoptime: Date | null;

  @Index()
  @Column({
    type: 'int',
    nullable: true,
  })
  acctinterval: number | null;

  @Index()
  @Column({
    type: 'int',
    unsigned: true,
    nullable: true,
  })
  acctsessiontime: number | null;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  acctauthentic: string | null;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  connectinfo_start: string | null;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  connectinfo_stop: string | null;

  @Column({
    type: 'bigint',
    nullable: true,
  })
  acctinputoctets: string | null;

  @Column({
    type: 'bigint',
    nullable: true,
  })
  acctoutputoctets: string | null;

  @Column({
    type: 'varchar',
    length: 255,
  })
  calledstationid: string;

  @Column({
    type: 'varchar',
    length: 255,
  })
  callingstationid: string;

  @Column({
    type: 'varchar',
    length: 255,
  })
  acctterminatecause: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  servicetype: string | null;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  framedprotocol: string | null;

  @Index()
  @Column({
    type: 'varchar',
    length: 255,
  })
  framedipaddress: string;

  @Index()
  @Column({
    type: 'varchar',
    length: 255,
  })
  framedipv6address: string;

  @Index()
  @Column({
    type: 'varchar',
    length: 255,
  })
  framedipv6prefix: string;

  @Index()
  @Column({
    type: 'varchar',
    length: 255,
  })
  framedinterfaceid: string;

  @Index()
  @Column({
    type: 'varchar',
    length: 255,
  })
  delegatedipv6prefix: string;

  @Index()
  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  class: string | null;
}
