import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsInt,
  IsOptional,
  IsBoolean,
  IsDateString,
} from 'class-validator';

export class CreateDomainDto {
  @ApiProperty({ example: 'Ahmed Ali' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsInt()
  user_id?: number;

  @ApiProperty({
    example: '2026-08-29T00:00:00.000Z',
    description: 'Subscription start date',
  })
  @IsNotEmpty()
  @IsDateString()
  subscription_start_date: string;

  @ApiPropertyOptional({
    example: '2027-08-29T00:00:00.000Z',
    description: 'Subscription end date',
  })
  @IsOptional()
  @IsDateString()
  subscription_end_date?: string;
}
