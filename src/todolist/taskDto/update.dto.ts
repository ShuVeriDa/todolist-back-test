import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  text: string;

  @IsBoolean()
  completed: boolean;

  @IsString()
  todolistId: string;
}
