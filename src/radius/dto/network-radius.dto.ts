import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsNotEmpty,
  IsOptional,
  IsInt,
  IsString,
  IsBoolean,
  isNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateNetworkRadiusDto {
  @ApiProperty({ example: 2, required: true })
  @IsNotEmpty()
  @IsInt()
  network_id: number;

  @ApiProperty({ example: 'mdqwwq', required: true })
  @IsNotEmpty()
  @IsString()
  username: string;
}
