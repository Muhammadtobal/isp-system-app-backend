import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsInt,
  IsString,
  IsDateString,
  IsBoolean,
  IsOptional,
} from 'class-validator';

export class CreateAlertDto {
  @ApiProperty({ example: 1, required: true })
  @IsNotEmpty()
  @IsInt()
  user_id: number;
}
