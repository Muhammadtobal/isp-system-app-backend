import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, ValidateNested } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { PaginationInput, SortInput } from 'src/shared/dto';

export class FindAllPermissionDto {
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
      field: 'id',
      order: 'DESC',
    },
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => SortInput)
  sort?: SortInput;
}
