import { Type } from "class-transformer";
import {
  IsArray,
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
} from "class-validator";

export class MatchInput {
  @IsNotEmpty()
  @IsString()
  value: string;

  @IsNotEmpty()
  @IsString()
  op: "full" | "partial";
}

export class SingleDateInput {
  @IsNotEmpty()
  @IsString()
  value: string;
}

export class RangeDateInput {
  @IsNotEmpty()
  @IsString()
  min: string;

  @IsNotEmpty()
  @IsString()
  max: string;
}

export class MinDateInput {
  @IsNotEmpty()
  @IsString()
  min: string;
}

export class MaxDateInput {
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
  @IsNumberString()
  value: string;
}

export class ListOfIdsInput {
  @IsNotEmpty()
  @IsArray()
  ids: string[];
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
  type: "ASC" | "DESC";
}
