import { IsNumber, IsString } from 'class-validator';

export class PaginationDto {
  @IsNumber()
  page: number;
}
