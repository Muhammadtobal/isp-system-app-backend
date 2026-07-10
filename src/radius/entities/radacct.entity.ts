import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';

@Entity('radacct')
export class RadAcct {
  @PrimaryGeneratedColumn()
  radacctid: number;

  @Column({ length: 64 })
  acctsessionid: string;

  @Column({ length: 32 })
  acctuniqueid: string;

  @Index()
  @Column({ length: 64 })
  username: string;

  @Column({ nullable: true })
  realm: string;

  @Column({ length: 15 })
  nasipaddress: string;

  @Column({ nullable: true })
  acctstarttime: Date;

  @Column({ nullable: true })
  acctupdatetime: Date;

  @Column({ nullable: true })
  acctstoptime: Date;

  @Column({ nullable: true })
  acctsessiontime: number;

  @Column({ nullable: true })
  acctinputoctets: number;

  @Column({ nullable: true })
  acctoutputoctets: number;

  @Column({ length: 15 })
  framedipaddress: string;

  @Column({ length: 50 })
  callingstationid: string;

  @Column({ length: 50 })
  calledstationid: string;
}
