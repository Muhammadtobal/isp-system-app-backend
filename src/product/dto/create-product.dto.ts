import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({
    example: 100.5,
  })
  @IsNotEmpty()
  @IsNumber()
  price: number;

  @ApiProperty({
    example: 'Some notes',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    example: 1,
  })
  @IsNotEmpty()
  @IsInt()
  product_type_id: number;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsInt()
  user_id?: number;
}
