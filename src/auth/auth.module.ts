import { JwtModule } from '@nestjs/jwt';
import { forwardRef, Module } from '@nestjs/common';

import { AuthService } from './auth.service';
import { JwtOrganizationStrategy } from './strategies/jwt-organization.strategy';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { EmployeeModule } from 'src/employee/employee.module';
import { AdminModule } from 'src/admin/admin.module';
// import { AdminModule } from "src/admin/admin.module";

@Module({
  imports: [
    JwtModule.register({ signOptions: { expiresIn: '1h' } }),
    forwardRef(() => UserModule),
    forwardRef(() => EmployeeModule),
    forwardRef(() => AdminModule),
  ],
  exports: [AuthService],
  providers: [AuthService, JwtOrganizationStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
