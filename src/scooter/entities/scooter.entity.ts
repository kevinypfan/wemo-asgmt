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
}
