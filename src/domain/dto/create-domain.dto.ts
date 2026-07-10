import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsInt,
  IsOptional,
  IsBoolean,
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
}
