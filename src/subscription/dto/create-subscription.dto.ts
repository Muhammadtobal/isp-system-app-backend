import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsInt,
  IsString,
  IsDateString,
  IsBoolean,
  IsOptional,
} from 'class-validator';

export class CreateSubscriptionDto {
  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsInt()
  plan_id: number;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsInt()
  customer_id: number;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsInt()
  point_id: number;

  @ApiProperty({ example: '2024-01-01' })
  @IsNotEmpty()
  @IsDateString()
  start_date: string;

  @ApiProperty({ example: '2024-12-31' })
  @IsNotEmpty()
  @IsDateString()
  end_date: string;

  @ApiProperty({ example: 'active' })
  @IsNotEmpty()
  @IsString()
  status: string;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
