import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsInt,
  IsNumber,
  IsOptional,
  IsBoolean,
  IsString,
} from 'class-validator';

export class CreatePaymentDto {
  @ApiProperty({ example: 'sub-KZKVTL' })
  @IsNotEmpty()
  @IsString()
  subscription_code: string;

  @ApiProperty({ example: 49.99 })
  @IsOptional()
  @IsNumber()
  amount?: number;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsInt()
  user_id?: number;
}
