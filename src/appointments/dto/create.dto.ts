import { IsArray, IsNumber, IsObject, IsString } from 'class-validator';

export class CreateDto {
  @IsString()
  name: string;

  @IsNumber()
  phone: number;

  @IsArray()
  cards: string[];

  @IsNumber()
  price: number;

  @IsString()
  dateTime: string;
}
