import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsBoolean, IsOptional } from 'class-validator';

export class CreatePermissionDto {
  @ApiProperty({ example: 'CREATE_USER' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'Allows creating users', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'translation', required: false })
  @IsOptional()
  @IsString()
  translation?: string;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  visual_for_emp?: boolean;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  visual_for_user?: boolean;
}
