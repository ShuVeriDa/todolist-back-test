import {
  Body,
  Controller,
  HttpCode,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { TodolistService } from './todolist.service';
import { Auth } from '../auth/decorators/auth.decorator';
import { CreateTodolistDto } from './dto/create.dto';
import { User } from '../user/decorators/user.decorator';

@Controller('todolist')
export class TodolistController {
  constructor(private readonly todolistService: TodolistService) {}

  @UsePipes(new ValidationPipe())
  @Post()
  @HttpCode(200)
  @Auth()
  create(@Body() dto: CreateTodolistDto, @User('id') userId: string) {
    return this.todolistService.create(dto, userId);
  }
}
