import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateTodolistDto {
  @IsString()
  title: string;
}
