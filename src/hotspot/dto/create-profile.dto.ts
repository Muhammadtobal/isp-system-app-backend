import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  IsInt,
  IsNotEmpty,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class CreateHotspotProfileDto {
  @ApiProperty({
    example: 'Hotspot 1 Day',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    example: 10000,
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  download_speed: number;

  @ApiProperty({
    example: 5000,
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  upload_speed: number;

  @ApiProperty({
    example: 86400,
    required: false,
  })
  @IsOptional()
  @IsInt()
  session_time?: number;

  @ApiProperty({
    example: 5000,
    required: false,
  })
  @IsOptional()
  @IsInt()
  quota_mb?: number;

  @ApiProperty({
    example: 5.0,
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  price: number;

  @ApiProperty({
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @ApiProperty({
    example: 1,
    required: true,
  })
  @IsOptional()
  @IsInt()
  user_id?: number;
}
