import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsInt,
  IsOptional,
  IsBoolean,
} from 'class-validator';

export class CreateCustomerDto {
  @ApiProperty({ example: 'Ahmed Ali' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: '0501234567' })
  @IsNotEmpty()
  @IsString()
  phone: string;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsInt()
  network_id: number;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
