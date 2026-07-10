import { IsNotEmpty, IsOptional, IsString, IsBoolean } from 'class-validator';

export class ResetMyPasswordDto {
  @IsNotEmpty()
  @IsString()
  new_password: string;

  @IsNotEmpty()
  @IsString()
  current_password: string;
}
