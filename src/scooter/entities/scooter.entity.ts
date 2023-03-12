import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity('core_scooters')
export class Scooter {
  @PrimaryGeneratedColumn({ name: 'id_scooters' })
  idScooters?: number;

  @Column()
  brand?: string;

  @Column()
  @Index({ unique: true })
  licensePlate?: string;

  @Column({ name: 'add_id_users' })
  addIdUsers?: number;

  @Column({ name: 'upd_id_users' })
  updIdUsers?: number;

  @Column({ name: 'add_date' })
  addDate?: Date;

  @Column({ name: 'upd_date' })
  updDate?: Date;
}
