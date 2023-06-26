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
import { UpdateTodolistDto } from './dto/update.dto';

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

  async updateTodolist(
    dto: UpdateTodolistDto,
    todolistId: string,
    userId: string,
  ) {
    const todolist = await this.findOneTodolist(todolistId, userId);

    if (!todolist) throw new NotFoundException('Todolist not found');

    await this.todolistRepository.update(
      {
        id: todolist.id,
      },
      { title: dto.title },
    );

    const fetchTodolist = await this.findOneTodolist(todolistId, userId);

    return this.findOneTodolist(fetchTodolist.id, userId);
  }

  async deleteTodolist(todolistId: string, userId: string) {
    await this.todolistRepository.manager.transaction(async (manager) => {
      const todolist = await manager.findOne(TodolistEntity, {
        where: { id: todolistId },
        relations: ['tasks', 'user'],
      });

      if (!todolist) throw new NotFoundException('Todolist not found');

      const isAuthor = todolist.user.id === userId;

      if (!isAuthor)
        throw new ForbiddenException("You don't have access to this todolist");

      const tasks = todolist.tasks;

      if (!tasks) {
        await manager.remove(todolist);
      }

      for (const task of tasks) {
        await manager.remove(task);
      }

      await manager.remove(todolist);
    });
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
