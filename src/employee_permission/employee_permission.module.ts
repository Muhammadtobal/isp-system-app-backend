import { Module } from '@nestjs/common';
import { EmployeePermissionService } from './employee_permission.service';
import { EmployeePermissionController } from './employee_permission.controller';

@Module({
  controllers: [EmployeePermissionController],
  providers: [EmployeePermissionService],
})
export class EmployeePermissionModule {}
