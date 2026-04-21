import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'org@gmail.com',
    description: 'Organization email address',
  })
  @IsNotEmpty()
  @IsString()
  email: string;

  @ApiProperty({
    example: 'strongPassword123',
    description: 'Organization password',
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}
