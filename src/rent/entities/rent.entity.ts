import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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

  @Column({ name: 'end_date' })
  endDate?: Date;
}
