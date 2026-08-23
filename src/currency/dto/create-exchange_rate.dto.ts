import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateExchangeRateDto {
  @ApiProperty({
    example: 1,
    description: 'Source currency ID',
  })
  @IsNotEmpty()
  @IsNumber()
  currency_id: number;

  @ApiProperty({
    example: 2,
    description: 'Target currency ID',
  })
  @IsNotEmpty()
  @IsNumber()
  to_currency_id: number;

  @ApiProperty({
    example: 0.92,
    description:
      'Exchange rate from the source currency to the target currency',
  })
  @IsNotEmpty()
  @IsNumber()
  rate: number;
}
