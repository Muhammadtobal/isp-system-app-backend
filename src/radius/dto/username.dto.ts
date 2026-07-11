import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UsernameDto {
  @ApiProperty({
    example: 'ahmad',
  })
  @IsString()
  @IsNotEmpty()
  username: string;
}
