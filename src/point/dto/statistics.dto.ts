import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import {
  ListOfIdsInput,
  MatchInput,
  PaginationInput,
  SingleIdInput,
  SortInput,
} from 'src/shared/dto';
import { IsSingleIdOrList } from 'src/shared/decorators/is-single-id-or-list.decorator';
import { LocationDto } from 'src/subscription/dto/create-subscription.dto';

export class FindStatisticsDto {
  @ApiProperty({
    description: 'Network id (single or list)',
    example: { value: 1 },
    required: false,
  })
  @IsOptional()
  @IsObject()
  @IsSingleIdOrList()
  network_id?: SingleIdInput | ListOfIdsInput;

  @ApiPropertyOptional({
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  currency_id?: number;

  @ApiPropertyOptional({
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  to_currency_id?: number;
}
