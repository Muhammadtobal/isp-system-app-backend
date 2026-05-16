import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsObject,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import {
  ListOfIdsInput,
  PaginationInput,
  SingleIdInput,
  SortInput,
} from 'src/shared/dto';
import { IsSingleIdOrList } from 'src/shared/decorators/is-single-id-or-list.decorator';

export class FindAllProductDto {
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

  @ApiProperty({
    description: 'user id (single or list)',
    example: { id: 1 },
    required: false,
  })
  @IsOptional()
  @IsObject()
  @IsSingleIdOrList()
  user_id?: SingleIdInput | ListOfIdsInput;
}
