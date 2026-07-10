import { Module } from '@nestjs/common';
import { EmployeePermissionService } from './employee_permission.service';
import { EmployeePermissionController } from './employee_permission.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeePermission } from './entities/employee_permission.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EmployeePermission])],
  exports: [EmployeePermissionService],
  controllers: [EmployeePermissionController],
  providers: [EmployeePermissionService],
})
export class EmployeePermissionModule {}
