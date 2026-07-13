import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { RadiusAttributeDto } from './radius-attribute.dto';

export class UpdateUserDto {
  @ApiPropertyOptional({
    example: 'ahmad-new',
    description: 'New username',
  })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiPropertyOptional({
    example: '123456',
    description: 'New password',
  })
  @IsOptional()
  @IsString()
  password?: string;

  @ApiPropertyOptional({
    type: [RadiusAttributeDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RadiusAttributeDto)
  checks?: RadiusAttributeDto[];

  @ApiPropertyOptional({
    type: [RadiusAttributeDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RadiusAttributeDto)
  replies?: RadiusAttributeDto[];

  @ApiPropertyOptional({
    example: false,
    description: 'Generate new username automatically',
  })
  @IsOptional()
  @IsBoolean()
  generateUsername?: boolean;
}
