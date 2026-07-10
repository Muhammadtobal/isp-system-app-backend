import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsNotEmpty,
  IsOptional,
  IsInt,
  IsString,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateSoldDto {
  @ApiProperty({ example: 10 })
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @ApiProperty({ example: 5 })
  @IsNotEmpty()
  @IsInt()
  product_id: number;

  @ApiProperty({ example: 2, required: false })
  @IsOptional()
  @IsInt()
  user_id?: number;

  @ApiProperty({ example: 'm', required: false })
  @IsOptional()
  @IsString()
  unit?: string;

  @ApiProperty({ example: 'true or false', required: false })
  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
