import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity('core_users')
export class User {
  @PrimaryGeneratedColumn({ name: 'id_users' })
  idUsers?: number;

  @Column()
  @Index({ unique: true })
  username?: string;

  @Column()
  password?: string;

  @Column({ name: 'last_login' })
  lastLogin?: Date;

  @Column()
  email?: string;
}
