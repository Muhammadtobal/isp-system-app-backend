import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsObject,
  IsOptional,
  ValidateNested,
  IsString,
  IsBoolean,
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
      by: 'username',
      type: 'ASC',
    },
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => SortInput)
  sort?: SortInput;
  @ApiProperty({
    example: '{ op : "full or partial" value:"example"}',
    required: false,
  })
  @IsOptional()
  @IsObject()
  @Type(() => MatchInput)
  username?: string;

  @ApiPropertyOptional({
    description: 'Active status',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @ApiProperty({
    description: 'user id (single or list)',
    example: { id: 1 },
    required: false,
  })
  @IsOptional()
  @IsObject()
  @IsSingleIdOrList()
  network_id?: SingleIdInput | ListOfIdsInput;

  @ApiProperty({
    example: '{ op : "full or partial" value:"example"}',
    required: false,
  })
  @IsOptional()
  @IsObject()
  @Type(() => MatchInput)
  service_type?: MatchInput;
}
