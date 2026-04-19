import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginAdminDto {
  @ApiProperty({
    example: 'admin@gmail.com',
    description: 'Admin email address',
  })
  @IsNotEmpty()
  @IsString()
  email: string;

  @ApiProperty({
    example: 'strongPassword123',
    description: 'Admin password',
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}
