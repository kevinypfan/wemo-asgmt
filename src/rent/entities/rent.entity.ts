import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('core_rents')
export class Rent {
  @PrimaryGeneratedColumn({ name: 'id_rents' })
  idRents?: number;

  @Column({ name: 'id_users' })
  idUsers: number;

  @Column({ name: 'id_scooters' })
  idScooters: number;

  @Column({ name: 'start_date' })
  startDate?: Date;

  @Column({ name: 'end_date', nullable: true })
  endDate?: Date;

  @Column({ name: 'add_id_users', nullable: true })
  addIdUsers?: number;

  @Column({ name: 'upd_id_users', nullable: true })
  updIdUsers?: number;

  @CreateDateColumn({ name: 'add_date' })
  addDate?: Date;

  @UpdateDateColumn({ name: 'upd_date' })
  updDate?: Date;
}
