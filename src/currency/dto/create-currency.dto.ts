import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateCurrencyDto {
  @ApiProperty({
    example: 'US Dollar',
    description: 'Currency name',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  name: string;

  @ApiProperty({
    example: 'USD',
    description: 'Currency code',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  code: string;
}
