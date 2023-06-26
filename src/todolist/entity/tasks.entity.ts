import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';
import { IsBoolean } from 'class-validator';
import { TodolistEntity } from './todolist.entity';

@Entity('tasks')
export class TasksEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  text: string;

  @IsBoolean()
  completed: boolean;

  @ManyToOne(() => TodolistEntity, { eager: true, nullable: false })
  @JoinColumn({ name: 'todolistId' })
  todolist: TodolistEntity;
}
