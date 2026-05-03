import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsInt, IsOptional } from 'class-validator';

export class CreateEmployeePermissionDto {
  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsInt()
  employee_id: number;

  @ApiProperty({ example: 2 })
  @IsNotEmpty()
  @IsInt()
  permission_id: number;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsInt()
  user_id?: number;
}
