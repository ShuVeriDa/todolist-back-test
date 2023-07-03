import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('appointments')
export class AppointmentsEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  phone: number;

  @Column('text', { array: true, default: null })
  cards: string[];

  @Column()
  price: number;

  // @Column()
  // @IsDate()
  // @IsDateString()
  // dateTime: Date;

  @Column()
  dateTime: string;
  //
  // @ManyToOne(() => UserEntity, { eager: true, nullable: false })
  // user: UserEntity;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
