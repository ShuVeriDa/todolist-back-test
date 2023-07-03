import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsDate, IsDateString } from 'class-validator';
import { UserEntity } from '../../auth/entity/user.entity';

@Entity('appointments')
export class AppointmentsEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  phone: number;

  @ManyToOne(() => Card)
  card: {
    title: string;
    price: number;
  };

  @Column()
  @IsDate()
  @IsDateString()
  dateTime: Date;

  @ManyToOne(() => UserEntity, { eager: true, nullable: false })
  user: UserEntity;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
