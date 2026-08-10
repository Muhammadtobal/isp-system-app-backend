import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsInt,
  ValidateNested,
} from 'class-validator';
import { LocationDto } from 'src/subscription/dto/create-subscription.dto';

export class CreateNetworkDto {
  @ApiProperty({ example: 'Main Network' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsInt()
  user_id: number;

  @ApiProperty({
    type: LocationDto,
    required: false,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => LocationDto)
  location?: LocationDto;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
