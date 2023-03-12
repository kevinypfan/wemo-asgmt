import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('core_scooters')
export class Scooter {
  @PrimaryGeneratedColumn({ name: 'id_scooters' })
  idScooters?: number;

  @Column()
  brand?: string;

  @Column()
  @Index({ unique: true })
  licensePlate?: string;

  @Column({ name: 'add_id_users', nullable: true })
  addIdUsers?: number;

  @Column({ name: 'upd_id_users', nullable: true })
  updIdUsers?: number;

  @CreateDateColumn({ name: 'add_date' })
  addDate?: Date;

  @UpdateDateColumn({ name: 'upd_date' })
  updDate?: Date;
}
