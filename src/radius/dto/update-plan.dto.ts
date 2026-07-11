import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsObject, IsString } from 'class-validator';

export class UpdatePlanDto {
  @ApiProperty({
    example: 'ahmad',
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    example: {
      download_speed: 40960,
      upload_speed: 20480,
      simultaneous_use: 2,
      session_timeout: 7200,
    },
  })
  @IsObject()
  plan: any;
}
