import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsInt,
  IsOptional,
  IsBoolean,
  IsDateString,
} from 'class-validator';

export class CreateCustomerDto {
  @ApiProperty({ example: 'Ahmed Ali' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsInt()
  plan_id: number;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsInt()
  point_id: number;

  @ApiProperty({ example: '0501234567' })
  @IsNotEmpty()
  @IsString()
  phone: string;

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

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsInt()
  network_id: number;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsInt()
  user_id?: number;
}
