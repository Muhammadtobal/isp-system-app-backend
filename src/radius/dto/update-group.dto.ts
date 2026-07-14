import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';
import { RadiusAttributeDto } from './radius-attribute.dto';

export class UpdateGroupDto {
  @ApiPropertyOptional({
    example: 'Premium-New',
    description: 'New group name',
  })
  @IsOptional()
  @IsString()
  groupname?: string;

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
}
