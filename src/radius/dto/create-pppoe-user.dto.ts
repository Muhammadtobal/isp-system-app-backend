import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsObject,
  IsString,
  ValidateNested,
} from 'class-validator';
import { RadiusAttributeDto } from './radius-attribute.dto';
import { Type } from 'class-transformer';

export class CreatePppoeUserDto {
  @ApiProperty({
    example: 'ahmad',
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    example: '123456',
  })
  @IsString()
  @IsNotEmpty()
  password: string;

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
}
