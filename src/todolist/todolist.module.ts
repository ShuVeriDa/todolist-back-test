import { Module } from '@nestjs/common';
import { TodolistController } from './todolist.controller';
import { TodolistService } from './todolist.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodolistEntity } from './entity/todolist.entity';
import { TasksEntity } from './entity/tasks.entity';
import { UserEntity } from '../user/entity/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([TodolistEntity, TasksEntity, UserEntity]),
  ],
  controllers: [TodolistController],
  providers: [TodolistService],
})
export class TodolistModule {}
