import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsNotEmpty,
  IsOptional,
  IsInt,
  IsString,
  IsBoolean,
  isNotEmpty,
  IsObject,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ServiceType } from 'src/shared/enums/service_type.enum';
import { MatchInput } from 'src/shared/dto';

export class CreateNetworkRadiusDto {
  @ApiProperty({ example: 2, required: true })
  @IsNotEmpty()
  @IsInt()
  network_id: number;

  @ApiProperty({
    example: ServiceType.HOTSPOT,
    enum: ServiceType,
    description: 'service_type  (user or admin)',
  })
  @IsNotEmpty()
  @IsString()
  service_type: ServiceType;

  @ApiProperty({ example: 'mdqwwq', required: true })
  @IsNotEmpty()
  @IsString()
  username: string;
}

export class CreateGroupNetworkRadiusDto {
  @ApiProperty({ example: 2, required: true })
  @IsNotEmpty()
  @IsInt()
  network_id: number;

  @ApiProperty({ example: 'mdqwwq', required: true })
  @IsNotEmpty()
  @IsString()
  groupname: string;
}
