import {
  ArrayNotEmpty,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class AssignPermissionDto {
  @ApiProperty({
    example: [1, 2, 3],
    description: 'List of permission IDs to assign to employee',
    type: [Number],
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  permission_ids: number[];

  @ApiProperty({
    example: 1,
    description: 'Employee ID',
    type: Number,
  })
  @IsNotEmpty()
  @IsInt()
  employee_id: number;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsInt()
  user_id?: number;
}
