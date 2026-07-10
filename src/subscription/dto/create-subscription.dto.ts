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

  @ApiProperty({
    example: '2026-07-09T00:00:00Z',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  start_date?: string;

  @ApiProperty({
    example: '2026-08-09T00:00:00Z',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  expire_date?: string;

  @ApiProperty({
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  auto_renew?: boolean;

  @ApiProperty({
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  status?: boolean;

  @ApiProperty({
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsInt()
  user_id?: number;
}
