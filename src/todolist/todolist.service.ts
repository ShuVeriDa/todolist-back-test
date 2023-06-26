import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TodolistEntity } from './entity/todolist.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTodolistDto } from './dto/create.dto';
import { UserEntity } from '../user/entity/user.entity';

@Injectable()
export class TodolistService {
  @InjectRepository(UserEntity)
  private readonly userRepository: Repository<UserEntity>;
  @InjectRepository(TodolistEntity)
  private readonly todolistRepository: Repository<TodolistEntity>;

  async findAllTodolist(userId: string) {
    const todolists = await this.todolistRepository.find({
      where: { user: { id: userId } },
    });

    return todolists.map((todolist) => this.returnTodolist(todolist));
  }

  async findOneTodolist(todolistId: string, userId: string) {
    const todolist = await this.todolistRepository.findOne({
      where: { id: todolistId },
      relations: ['user'],
    });

    if (todolist.user.id !== userId)
      throw new ForbiddenException('You do not have access to this todolist');

    return this.returnTodolist(todolist);
  }

  async createTodolist(dto: CreateTodolistDto, userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) throw new NotFoundException('User not found');

    const newTodolist = await this.todolistRepository.save({
      title: dto.title,
      tasks: [],
      user: { id: user.id },
    });

    const todolist = await this.todolistRepository.findOne({
      where: { id: newTodolist.id },
      relations: ['user'],
    });

    return this.returnTodolist(todolist);
  }

  returnTodolist(todolist: TodolistEntity) {
    return {
      id: todolist.id,
      title: todolist.title,
      tasks: todolist.tasks || [],
      user: {
        id: todolist.user.id,
        nickname: todolist.user.nickname,
      },
    };
  }
}
