import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('core_scooters')
export class Scooter {
  @PrimaryGeneratedColumn({ name: 'id_scooters' })
  idScooters?: number;

  @Column()
  brand?: string;

  @Column()
  licensePlate?: string;
}
