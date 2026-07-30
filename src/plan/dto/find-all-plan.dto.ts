import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsObject,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import {
  ApiProperty,
  ApiPropertyOptional,
  getSchemaPath,
} from '@nestjs/swagger';

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

export class FindAllPlanDto {
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
    description: 'Network id (single or list)',
    example: { id: 1 },
    required: false,
  })
  @IsOptional()
  @IsObject()
  @IsSingleIdOrList()
  network_id?: SingleIdInput | ListOfIdsInput;

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

  @ApiProperty({
    example: '{ op : "full or partial" value:"example"}',
    required: false,
  })
  @IsOptional()
  @IsObject()
  @Type(() => MatchInput)
  service_type?: MatchInput;

  @ApiPropertyOptional({
    description: 'Filter by price (single number or range or min/max)',
    oneOf: [
      { $ref: getSchemaPath(SingleNumberInput) },
      { $ref: getSchemaPath(RangeNumberInput) },
      { $ref: getSchemaPath(MinNumberInput) },
      { $ref: getSchemaPath(MaxNumberInput) },
    ],
    example: {
      single: {
        summary: 'Single price',
        value: { value: 100 },
      },
      range: {
        summary: 'Range',
        value: { min: 100, max: 500 },
      },
      min: {
        summary: 'Min only',
        value: { min: 100 },
      },
      max: {
        summary: 'Max only',
        value: { max: 500 },
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
