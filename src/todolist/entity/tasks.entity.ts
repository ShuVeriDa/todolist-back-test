import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { IsBoolean, IsString, MinLength } from 'class-validator';
import { UserEntity } from '../../user/entity/user.entity';
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
  todolist: TodolistEntity;
}
