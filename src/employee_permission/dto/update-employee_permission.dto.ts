import { PartialType } from '@nestjs/swagger';
import { CreateEmployeePermissionDto } from './create-employee_permission.dto';

export class UpdateEmployeePermissionDto extends PartialType(CreateEmployeePermissionDto) {}
