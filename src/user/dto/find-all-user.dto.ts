import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { PaginationInput, SortInput } from 'src/shared/dto';

export class FindAllUserDto {
  @ApiProperty({
    description: 'Pagination object',
    example: {
      page: 1,
      limit: 10,
    },
  })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => PaginationInput)
  pagination: PaginationInput;

  @ApiPropertyOptional({
    description: 'Sort options',
    example: {
      by: 'id',
      type: 'DESC',
    },
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => SortInput)
  sort?: SortInput;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
