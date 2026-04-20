import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsInt, IsNumber } from 'class-validator';

export class CreatePaymentDto {
  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsInt()
  subscription_id: number;

  @ApiProperty({ example: 100.5 })
  @IsNotEmpty()
  @IsNumber()
  amount: number;
}
