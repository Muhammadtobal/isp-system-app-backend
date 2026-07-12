import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { RadiusAttributeDto } from './radius-attribute.dto';
import { Type } from 'class-transformer';

export class CreatePppoeUserDto {
  @ApiProperty({
    example: 'ahmad',
    required: false,
  })
  @IsString()
  @IsOptional()
  username?: string;

  @ApiProperty({
    required: false,
    example: '123456',
  })
  @IsString()
  @IsOptional()
  password?: string;

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
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  generateUsername?: boolean;
}
