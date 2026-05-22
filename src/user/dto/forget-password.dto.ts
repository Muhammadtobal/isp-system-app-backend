import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ForgotPasswordInput {
  @IsNotEmpty()
  @IsEmail()
  email: string;
}

export class ResetPasswordInput {
  @IsNotEmpty()
  @IsString()
  token: string;

  @IsNotEmpty()
  @IsString()
  newPassword: string;
}
