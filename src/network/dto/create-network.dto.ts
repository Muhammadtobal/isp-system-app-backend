import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateNetworkDto {
  @ApiProperty({ example: 'Main Network' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'Dubai - UAE' })
  @IsNotEmpty()
  @IsString()
  location: string;
}
