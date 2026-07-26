import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsObject,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import {
  ListOfIdsInput,
  MatchInput,
  MaxNumberInput,
  MinNumberInput,
  PaginationInput,
  RangeNumberInput,
  SingleIdInput,
  SingleNumberInput,
  SortInput,
} from 'src/shared/dto';
import { IsSingleIdOrList } from 'src/shared/decorators/is-single-id-or-list.decorator';
import { IsSingleNumberOrRange } from 'src/shared/decorators/is-single-number-or-range.decorator';

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

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @ApiProperty({
    example: '{ op : "full or partial" value:"example"}',
    required: false,
  })
  @IsOptional()
  @IsObject()
  @Type(() => MatchInput)
  name?: MatchInput;

  @ApiPropertyOptional({
    description: 'Price filter (single value or range)',
    examples: {
      single: {
        summary: 'Equal to',
        value: {
          value: 50,
        },
      },
      min: {
        summary: 'Greater than or equal',
        value: {
          min: 50,
        },
      },
      max: {
        summary: 'Less than or equal',
        value: {
          max: 100,
        },
      },
      range: {
        summary: 'Between min and max',
        value: {
          min: 50,
          max: 100,
        },
      },
    },
  })
  @IsOptional()
  @IsObject()
  @IsSingleNumberOrRange()
  price?:
    | SingleNumberInput
    | RangeNumberInput
    | MaxNumberInput
    | MinNumberInput;
}
