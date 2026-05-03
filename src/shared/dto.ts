import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';

export class MatchInput {
  @IsNotEmpty()
  @IsString()
  value: string;

  @IsNotEmpty()
  @IsString()
  op: 'full' | 'partial';
}

export class SingleDateInput {
  @ApiProperty({ example: '2026-04-25' })
  @IsNotEmpty()
  @IsString()
  value: string;
}

export class RangeDateInput {
  @ApiProperty({ example: '2026-04-25' })
  @IsNotEmpty()
  @IsString()
  min: string;

  @IsNotEmpty()
  @IsString()
  max: string;
}

export class MinDateInput {
  @ApiProperty({ example: '2026-04-25' })
  @IsNotEmpty()
  @IsString()
  min: string;
}

export class MaxDateInput {
  @ApiProperty({ example: '2026-04-25' })
  @IsNotEmpty()
  @IsString()
  max: string;
}

export class SingleNumberInput {
  @IsNotEmpty()
  @IsInt()
  value: number;
}

export class MinNumberInput {
  @IsNotEmpty()
  @IsInt()
  min: number;
}

export class MaxNumberInput {
  @IsNotEmpty()
  @IsInt()
  max: number;
}

export class RangeNumberInput {
  @IsNotEmpty()
  @IsInt()
  min: number;

  @IsNotEmpty()
  @IsInt()
  max: number;
}

export class SingleIdInput {
  @IsNotEmpty()
  @IsInt()
  value: number;
}

export class ListOfIdsInput {
  @IsNotEmpty()
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  ids: number[];
}

export class PaginationInput {
  @Type(() => Number)
  @IsInt()
  @IsNotEmpty()
  limit: number;

  @Type(() => Number)
  @IsInt()
  @IsNotEmpty()
  page: number;
}

export class SortInput {
  @IsNotEmpty()
  @IsString()
  by: string;

  @IsNotEmpty()
  @IsString()
  type: 'ASC' | 'DESC';
}
