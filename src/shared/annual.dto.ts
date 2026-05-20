import { Type } from 'class-transformer';
import {
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
  MaxDateInput,
  MinDateInput,
  PaginationInput,
  RangeDateInput,
  SingleDateInput,
  SingleIdInput,
  SortInput,
} from 'src/shared/dto';
import { IsSingleIdOrList } from 'src/shared/decorators/is-single-id-or-list.decorator';
import { IsSingleDateOrRange } from 'src/shared/decorators/is-single-date-or-range.decorator';

export class AnnualDto {
  @ApiProperty({
    description: 'Filter by created_at (single date or range or min/max)',
    oneOf: [{ $ref: getSchemaPath(SingleDateInput) }],
    example: {
      value: '2026',
    },
  })
  @IsNotEmpty()
  @IsObject()
  @IsSingleDateOrRange()
  created_at: SingleDateInput;
}
