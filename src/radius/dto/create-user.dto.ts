import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

import { RadiusAttributeDto } from './radius-attribute.dto';

export class CreateUserDto {
  @ApiProperty({
    example: 'guest001',
    required: false,
  })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiProperty({ example: 2, required: true })
  @IsNotEmpty()
  @IsInt()
  network_id: number;

  @ApiProperty({
    example: '123456',
    required: false,
  })
  @IsOptional()
  @IsString()
  password?: string;

  @ApiProperty({
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  generateUsername?: boolean;

  @ApiProperty({
    type: [RadiusAttributeDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RadiusAttributeDto)
  checks: RadiusAttributeDto[];

  @ApiProperty({
    type: [RadiusAttributeDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RadiusAttributeDto)
  replies: RadiusAttributeDto[];
  @ApiProperty({
    example: 1,
    required: false,
    description: 'عدد المستخدمين المراد إنشاؤهم',
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  count?: number;
}

export interface HotspotUserResult {
  username: string;
  password: string;
}
