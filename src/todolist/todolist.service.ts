import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TodolistEntity } from './entity/todolist.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTodolistDto } from './todolistDto/create.dto';
import { UserEntity } from '../user/entity/user.entity';
import { UpdateTodolistDto } from './todolistDto/update.dto';
import { CreateTaskDto } from './taskDto/create.dto';
import { User } from '../user/decorators/user.decorator';
import { TasksEntity } from './entity/tasks.entity';
import { UpdateTaskDto } from './taskDto/update.dto';
import { PaginationDto } from './todolistDto/pagination.dto';

@Injectable()
export class TodolistService {
  @InjectRepository(UserEntity)
  private readonly userRepository: Repository<UserEntity>;
  @InjectRepository(TodolistEntity)
  private readonly todolistRepository: Repository<TodolistEntity>;
  @InjectRepository(TasksEntity)
  private readonly taskRepository: Repository<TasksEntity>;

  //////////////
  // Todolist//
  ////////////

  async findAllTodolist(userId: string) {
    const todolists = await this.todolistRepository.find({
      where: { user: { id: userId } },
      relations: ['tasks'],
    });

    return todolists.map((todolist) => this.returnTodolist(todolist));
  }

  async findOneTodolist(
    todolistId: string,
    userId: string,
    dto?: PaginationDto,
  ) {
    const todolist = await this.todolistRepository.findOne({
      where: { id: todolistId },
      relations: ['user', 'tasks'],
    });

    if (!todolist) throw new NotFoundException('Todolist not found');

    if (todolist.user.id !== userId)
      throw new ForbiddenException('You do not have access to this todolist');

    if (dto) {
      const limit = 5;
      const skip = (dto.page - 1) * limit;

      const [tasks, total] = await this.taskRepository.findAndCount({
        where: { todolist: { id: todolist.id } },
        skip: skip,
        take: limit,
      });

      const createdTasks = tasks.map((task) => {
        delete task.todolist;
        return task;
      });

      return {
        ...todolist,
        user: {
          id: todolist.user.id,
          nickname: todolist.user.nickname,
        },
        tasks: createdTasks,
      };
    }

    if (!dto) return this.returnTodolist(todolist);
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

    await this.todolistRepository.update(
      {
        id: todolist.id,
      },
      { title: dto.title },
    );

    return this.findOneTodolist(todolist.id, userId);
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
    const tasks = todolist?.tasks?.map((task) => {
      delete task.todolist;
      return task;
    });
    return {
      id: todolist.id,
      title: todolist.title,
      tasks: tasks || [],
      user: {
        id: todolist.user.id,
        nickname: todolist.user.nickname,
      },
    };
  }

  //////////////
  // Tasks//
  ////////////

  async findOneTask(taskId: string, userId: string) {
    const task = await this.taskRepository.findOne({
      where: { id: taskId },
      relations: ['todolist', 'todolist.user'],
    });

    if (!task) throw new NotFoundException('Task not found');

    const isAuthor = task.todolist.user.id === userId;

    if (!isAuthor)
      throw new ForbiddenException('You do not have access to this task');

    return {
      ...task,
      todolist: {
        id: task.todolist.id,
        title: task.todolist.title,
        user: {
          id: task.todolist.user.id,
          nickname: task.todolist.user.nickname,
        },
      },
    };
  }

  async createTask(dto: CreateTaskDto, userId: string) {
    const todolist = await this.findOneTodolist(dto.todolistId, userId);

    await this.taskRepository.save({
      text: dto.text,
      todolist: { id: todolist.id },
    });

    return await this.findOneTodolist(todolist.id, userId);
  }

  async updateTask(dto: UpdateTaskDto, taskId: string, userId: string) {
    const todolist = await this.findOneTodolist(dto.todolistId, userId);
    const task = await this.findOneTask(taskId, userId);

    await this.taskRepository.update(
      { id: task.id },
      {
        text: dto.text,
        completed: dto.completed,
        todolist: { id: todolist.id },
      },
    );

    return await this.findOneTodolist(todolist.id, userId);
  }

  async deleteTask(taskId: string, userId: string) {
    const task = await this.findOneTask(taskId, userId);

    await this.taskRepository.delete({ id: task.id });
  }
}
