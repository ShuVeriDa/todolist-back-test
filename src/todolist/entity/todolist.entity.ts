import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  JoinColumn,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';
import { TasksEntity } from './tasks.entity';
import { UserEntity } from '../../auth/entity/user.entity';

@Entity('todolists')
export class TodolistEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  title: string;

  @OneToMany(() => TasksEntity, (task) => task.todolist, {
    eager: false,
    nullable: true,
  })
  @JoinColumn({ name: 'taskId' })
  tasks: TasksEntity[];

  @ManyToOne(() => UserEntity, { eager: true, nullable: false })
  user: UserEntity;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
