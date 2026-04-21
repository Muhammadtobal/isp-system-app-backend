import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsInt,
} from 'class-validator';

export class CreateNetworkDto {
  @ApiProperty({ example: 'Main Network' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsInt()
  user_id: number;

  @ApiProperty({ example: 'Dubai - UAE' })
  @IsNotEmpty()
  @IsString()
  location: string;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
