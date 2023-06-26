import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { UserEntity } from './user/entity/user.entity';
import { TodolistModule } from './todolist/todolist.module';
import { TodolistEntity } from './todolist/entity/todolist.entity';
import { TasksEntity } from './todolist/entity/tasks.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '5940530bbbb',
      database: 'todolist',
      entities: [UserEntity, TodolistEntity, TasksEntity],
      synchronize: true,
    }),
    AuthModule,
    UserModule,
    TodolistModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
