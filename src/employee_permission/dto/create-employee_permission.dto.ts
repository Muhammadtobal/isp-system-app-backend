import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsInt } from 'class-validator';

export class CreateEmployeePermissionDto {
  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsInt()
  employee_id: number;

  @ApiProperty({ example: 2 })
  @IsNotEmpty()
  @IsInt()
  permission_id: number;
}
