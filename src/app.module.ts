import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from './auth/auth.module';
import { UserEntity } from './auth/entity/user.entity';
import { TodolistModule } from './todolist/todolist.module';
import { TodolistEntity } from './todolist/entity/todolist.entity';
import { TasksEntity } from './todolist/entity/tasks.entity';
import * as process from 'process';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: 'postgres',
      password: '5940530bbbb',
      database: 'todolist',
      entities: [UserEntity, TodolistEntity, TasksEntity],
      synchronize: true,
    }),
    AuthModule,
    TodolistModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
