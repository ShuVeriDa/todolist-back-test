import { IsString } from 'class-validator';

export class CreateTodolistDto {
  @IsString()
  title: string;
}
