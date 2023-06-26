import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { TodolistService } from './todolist.service';
import { Auth } from '../auth/decorators/auth.decorator';
import { CreateTodolistDto } from './dto/create.dto';
import { User } from '../user/decorators/user.decorator';
import { UpdateTodolistDto } from './dto/update.dto';

@Controller('todolist')
export class TodolistController {
  constructor(private readonly todolistService: TodolistService) {}

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
  update(
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
}
