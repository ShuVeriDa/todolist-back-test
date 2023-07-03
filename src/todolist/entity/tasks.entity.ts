import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TodolistEntity } from './todolist.entity';

@Entity('tasks')
export class TasksEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  text: string;

  @Column({ default: false })
  completed: boolean;

  @ManyToOne(() => TodolistEntity, { eager: true, nullable: false })
  @JoinColumn({ name: 'todolistId' })
  todolist: TodolistEntity;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
