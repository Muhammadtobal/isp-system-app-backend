import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsEmail,
  MinLength,
  IsOptional,
  IsBoolean,
  IsInt,
  ArrayNotEmpty,
  IsArray,
} from 'class-validator';

export class CreateEmployeeDto {
  @ApiProperty({ example: 'test@example.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Ahmed Ali' })
  @IsNotEmpty()
  @IsString()
  full_name: string;

  @ApiProperty({ example: 'strongPassword123' })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({
    example: [1, 2, 3],
    required: true,
    type: [Number],
  })
  @IsNotEmpty()
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  network_ids: number[];

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsInt()
  user_id?: number;
}
