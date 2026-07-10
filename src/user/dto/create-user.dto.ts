import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsEmail,
  IsNotEmpty,
  IsBoolean,
} from 'class-validator';
import { Role } from 'src/shared/enums/role.enum';

export class CreateUserDto {
  @ApiProperty({
    example: 'Tech Company',
    description: 'Organization name',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    example: 'strongPassword123',
    description: 'Organization password',
  })
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty({
    example: 'Software development company',
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({
    example: 'org@gmail.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '00971501234567',
  })
  @IsNotEmpty()
  @IsString()
  phone: string;

  @ApiProperty({
    example: Role.USER,
    enum: Role,
    description: 'User role (user or admin)',
  })
  @IsNotEmpty()
  @IsString()
  role: Role;

  @ApiProperty({
    example: 'Dubai, UAE',
  })
  @IsNotEmpty()
  @IsString()
  address: string;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  active?: boolean;
  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
  })
  @IsOptional()
  logo?: any;
}
