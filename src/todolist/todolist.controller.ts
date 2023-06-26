import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { TodolistService } from './todolist.service';
import { Auth } from '../auth/decorators/auth.decorator';
import { CreateTodolistDto } from './todolistDto/create.dto';
import { User } from '../user/decorators/user.decorator';
import { UpdateTodolistDto } from './todolistDto/update.dto';
import { CreateTaskDto } from './taskDto/create.dto';
import { UpdateTaskDto } from './taskDto/update.dto';

@Controller('todolists')
export class TodolistController {
  constructor(private readonly todolistService: TodolistService) {}

  //////////////
  // Todolist//
  ////////////
  @Get()
  @Auth()
  findAllTodolist(@User('id') userId: string) {
    return this.todolistService.findAllTodolist(userId);
  }

  @Get(':id')
  @Auth()
  findOneTodolist(@Param('id') todolistId: string, @User('id') userId: string) {
    return this.todolistService.findOneTodolist(todolistId, userId);
  }

  @UsePipes(new ValidationPipe())
  @Post()
  @HttpCode(200)
  @Auth()
  createTodolist(@Body() dto: CreateTodolistDto, @User('id') userId: string) {
    return this.todolistService.createTodolist(dto, userId);
  }

  @UsePipes(new ValidationPipe())
  @Put(':id')
  @HttpCode(200)
  @Auth()
  updateTodolist(
    @Param('id') todolistId: string,
    @Body() dto: UpdateTodolistDto,
    @User('id') userId: string,
  ) {
    return this.todolistService.updateTodolist(dto, todolistId, userId);
  }

  @Delete(':id')
  @Auth()
  deleteTodolist(@Param('id') todolistId: string, @User('id') userId: string) {
    return this.todolistService.deleteTodolist(todolistId, userId);
  }

  //////////////
  // Tasks//
  ////////////

  @Get('tasks/:id')
  @Auth()
  findOneTask(@Param('id') taskId: string, @User('id') userId: string) {
    return this.todolistService.findOneTask(taskId, userId);
  }

  @UsePipes(new ValidationPipe())
  @Post('tasks')
  @HttpCode(200)
  @Auth()
  createTask(@Body() dto: CreateTaskDto, @User('id') userId: string) {
    return this.todolistService.createTask(dto, userId);
  }

  @UsePipes(new ValidationPipe())
  @Patch('tasks/:id')
  @HttpCode(200)
  @Auth()
  updateTask(
    @Param('id') taskId: string,
    @Body() dto: UpdateTaskDto,
    @User('id') userId: string,
  ) {
    return this.todolistService.updateTask(dto, taskId, userId);
  }
}
