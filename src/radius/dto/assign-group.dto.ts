import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AssignGroupDto {
  @ApiProperty({
    example: 'ahmad',
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    example: 'HOME-20M',
  })
  @IsString()
  @IsNotEmpty()
  groupname: string;
}
