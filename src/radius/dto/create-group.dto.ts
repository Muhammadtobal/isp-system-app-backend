import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { RadiusAttributeDto } from './radius-attribute.dto';
import { Type } from 'class-transformer';

export class CreateGroupDto {
  @ApiProperty({
    example: 'HOME-20M',
  })
  @IsString()
  name: string;

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
