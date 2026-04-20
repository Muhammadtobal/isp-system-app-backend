import { IsNotEmpty, IsNumberString } from 'class-validator';

export class AssignPermissionDto {
  @IsNotEmpty()
  @IsNumberString()
  permission_id: number;

  @IsNotEmpty()
  @IsNumberString()
  employee_id: number;
}
