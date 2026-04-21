import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateExpenseDto {
  @ApiProperty({
    example: 100.5,
  })
  @IsNotEmpty()
  @IsNumber()
  value: number;

  @ApiProperty({
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  expense_type_id: number;

  @ApiProperty({
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  network_id: number;

  @ApiPropertyOptional({
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  employee_id?: number;

  @ApiPropertyOptional({
    example: 'Some notes',
  })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
