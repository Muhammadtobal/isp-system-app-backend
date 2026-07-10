import { IsInt, IsNotEmpty } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class GenerateHotspotVoucherDto {
  @ApiProperty({
    example: 1,
  })
  @IsNotEmpty()
  @IsInt()
  profile_id: number;

  @ApiProperty({
    example: 1000,
  })
  @IsNotEmpty()
  @IsInt()
  quantity: number;
}
