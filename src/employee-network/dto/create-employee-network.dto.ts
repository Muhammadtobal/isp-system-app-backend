import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsInt, IsEmail, IsOptional } from 'class-validator';

export class CreateEmployeeNetworkDto {
  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsInt()
  network_id: number;

  @ApiProperty({
    example: 'org@gmail.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsInt()
  user_id?: number;
}
