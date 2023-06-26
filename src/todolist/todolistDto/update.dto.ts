import { IsOptional, IsString } from 'class-validator';

export class UpdateTodolistDto {
  @IsOptional()
  @IsString()
  title: string;
}
