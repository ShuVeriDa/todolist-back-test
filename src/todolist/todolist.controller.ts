import {
  Body,
  Controller,
  Get,
  HttpCode,
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
  findAll(@User('id') userId: string) {
    return this.todolistService.findAll(userId);
  }

  @UsePipes(new ValidationPipe())
  @Post()
  @HttpCode(200)
  @Auth()
  createTodolist(@Body() dto: CreateTodolistDto, @User('id') userId: string) {
    return this.todolistService.createTodolist(dto, userId);
  }
}
