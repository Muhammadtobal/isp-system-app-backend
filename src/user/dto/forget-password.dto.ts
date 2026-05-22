import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ForgotPasswordInput {
  @ApiProperty({
    example: 'org@gmail.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;
}

export class ResetPasswordInput {
  @ApiProperty({
    example: 'knfslkrjt34t35t35',
  })
  @IsNotEmpty()
  @IsString()
  token: string;

  @ApiProperty({
    example: 'newPassword',
  })
  @IsNotEmpty()
  @IsString()
  newPassword: string;
}
