import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsInt,
  IsNumber,
  IsBoolean,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ServiceType } from 'src/shared/enums/service_type.enum';

export class CreatePlanDto {
  @ApiProperty({ example: 'Premium Plan' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    example: 'pppoe',
    enum: ['pppoe', 'hotspot'],
  })
  @IsEnum(ServiceType)
  service_type: ServiceType;

  @ApiProperty({
    example: 20000,
    description: 'Download speed in Kbps',
  })
  @IsInt()
  download_speed: number;

  @ApiProperty({
    example: 20000,
    description: 'Upload speed in Kbps',
  })
  @IsInt()
  upload_speed: number;

  @ApiProperty({
    example: 102400,
    required: false,
    description: 'Quota in MB (NULL = Unlimited)',
  })
  @IsOptional()
  @IsInt()
  quota_mb?: number;

  @ApiProperty({
    example: 7200,
    required: false,
    description: 'Session timeout in seconds',
  })
  @IsOptional()
  @IsInt()
  session_timeout?: number;

  @ApiProperty({
    example: 30,
    required: false,
    description: 'Subscription validity in days',
  })
  @IsOptional()
  @IsInt()
  validity_days?: number;

  @ApiProperty({
    example: 1,
    description: 'Maximum simultaneous sessions',
  })
  @IsOptional()
  @IsInt()
  simultaneous_use?: number;

  @ApiProperty({ example: 49.99 })
  @IsNotEmpty()
  @IsNumber()
  price: number;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsInt()
  network_id: number;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsInt()
  user_id?: number;
}
