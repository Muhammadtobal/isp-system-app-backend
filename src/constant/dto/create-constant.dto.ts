import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsObject } from 'class-validator';

export class CreateConstantInput {
  @ApiProperty({
    example: 'ALERT_INTERVAL_DAYS',
    description: 'Unique key for the constant',
  })
  @IsNotEmpty()
  @IsString()
  key: string;

  @ApiProperty({
    example: {
      days: 30,
    },
    description: 'Constant value stored as JSON object',
    type: Object,
  })
  @IsNotEmpty()
  @IsObject()
  value: Record<string, any>;
}
