import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsBoolean, IsOptional } from 'class-validator';

export class CreatePermissionDto {
  @ApiProperty({ example: 'CREATE_USER' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'Allows creating users', required: false })
  @IsNotEmpty()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: true, required: false })
  @IsNotEmpty()
  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
