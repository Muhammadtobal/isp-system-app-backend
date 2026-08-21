import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateTemplateDto {
  @ApiProperty({
    example: 'Default Template',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    example: 1,
    required: true,
  })
  @IsNotEmpty()
  @IsInt()
  network_id: number;

  @ApiProperty({
    example: {
      lan: '4234',
      lot: '123456',
      any: 'any',
    },
  })
  @IsNotEmpty()
  @IsObject()
  config: Record<string, any>;

  @ApiProperty({
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
