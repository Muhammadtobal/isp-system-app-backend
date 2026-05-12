import { forwardRef, Module } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { EmployeeController } from './employee.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from './entities/employee.entity';
import { PermissionModule } from 'src/permission/permission.module';
import { EmployeePermissionModule } from 'src/employee_permission/employee_permission.module';
import { AuthModule } from 'src/auth/auth.module';
import { EmployeeNetworkModule } from 'src/employee-network/employee-network.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Employee]),
    forwardRef(() => AuthModule),
    PermissionModule,
    EmployeePermissionModule,
    forwardRef(() => EmployeeNetworkModule),
  ],
  exports: [EmployeeService],
  controllers: [EmployeeController],
  providers: [EmployeeService],
})
export class EmployeeModule {}
