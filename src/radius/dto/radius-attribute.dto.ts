import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RadiusAttributeDto {
  @ApiProperty({
    example: 'Cleartext-Password',
  })
  @IsString()
  @IsNotEmpty()
  attribute: string;

  @ApiProperty({
    example: ':=',
  })
  @IsString()
  @IsNotEmpty()
  op: string;

  @ApiProperty({
    example: '123456',
  })
  @IsString()
  @IsNotEmpty()
  value: string;
}
