import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsInt,
  IsNumber,
  IsBoolean,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePlanDto {
  @ApiProperty({ example: 'Premium Plan' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 100.5 })
  @IsNotEmpty()
  @IsNumber()
  speed: number;

  @ApiProperty({ example: 49.99 })
  @IsNotEmpty()
  @IsNumber()
  price: number;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsInt()
  network_id: number;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
