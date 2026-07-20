import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, IsNotEmpty } from 'class-validator';

export class CreateNasDto {
  @ApiProperty({
    example: '192.168.1.1',
    description: 'IP Address أو Hostname للجهاز',
  })
  @IsNotEmpty()
  @IsString()
  nasname: string;

  @ApiProperty({
    example: 'Main MikroTik',
    required: false,
  })
  @IsOptional()
  @IsString()
  shortname?: string;

  @ApiProperty({
    example: 'mikrotik',
    required: false,
    default: 'other',
  })
  @IsOptional()
  @IsString()
  type?: string;

  @ApiProperty({
    example: 32,
    required: false,
  })
  @IsOptional()
  @IsInt()
  ports?: number;

  @ApiProperty({
    example: 'radius123',
    description: 'Shared Secret',
  })
  @IsNotEmpty()
  @IsString()
  secret: string;

  @ApiProperty({
    example: 'default',
    required: false,
  })
  @IsOptional()
  @IsString()
  server?: string;

  @ApiProperty({
    example: 'public',
    required: false,
  })
  @IsOptional()
  @IsString()
  community?: string;

  @ApiProperty({
    example: 'Main Office MikroTik',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;
}
