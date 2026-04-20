import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateAdminDto {
  @ApiProperty({
    example: "Super Admin",
    description: "Admin name",
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    example: "strongPassword123",
    description: "Admin password",
  })
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty({
    example: "admin@gmail.com",
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: "0501234567",
  })
  @IsNotEmpty()
  @IsString()
  phone: string;

  @ApiPropertyOptional({
    example: "refresh_token_example",
    description: "Used for JWT refresh",
  })
  @IsOptional()
  @IsString()
  refresh_token?: string;
}
