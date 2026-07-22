import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsInt,
  IsString,
  IsDateString,
  IsBoolean,
  IsOptional,
  ValidateNested,
  IsNumber,
} from 'class-validator';

class LocationDto {
  @ApiProperty({
    example: 31.9539,
  })
  @IsNumber()
  latitude: number;

  @ApiProperty({
    example: 35.9106,
  })
  @IsNumber()
  longitude: number;
}

export class CreateSubscriptionDto {
  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsInt()
  plan_id: number;

  @ApiProperty({ example: 'm', required: true })
  @IsNotEmpty()
  @IsString()
  radius_username: string;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsInt()
  customer_id: number;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsInt()
  point_id: number;

  @ApiProperty({
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  status?: boolean;

  @ApiProperty({
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsInt()
  user_id?: number;

  @ApiProperty({
    type: LocationDto,
    required: false,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => LocationDto)
  location?: LocationDto;
}
