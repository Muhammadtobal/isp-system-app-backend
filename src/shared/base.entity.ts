import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export abstract class BaseEntity {
  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @Column({ type: 'boolean', default: true })
  active: boolean;

  @BeforeInsert()
  setCreatedDate() {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    this.created_at = d;
    this.updated_at = d;
  }

  @BeforeUpdate()
  setUpdatedDate() {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    this.updated_at = d;
  }
}
