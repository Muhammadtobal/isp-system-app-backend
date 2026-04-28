import { JwtModule } from '@nestjs/jwt';
import { forwardRef, Module } from '@nestjs/common';

import { AuthService } from './auth.service';
import { JwtUserStrategy } from './strategies/jwt-user.strategy';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { EmployeeModule } from 'src/employee/employee.module';
import { JwtEmployeeStrategy } from './strategies/jwt-employee.strategy';

@Module({
  imports: [
    JwtModule.register({ signOptions: { expiresIn: '1h' } }),
    forwardRef(() => UserModule),
    forwardRef(() => EmployeeModule),
  ],
  exports: [AuthService],
  providers: [AuthService, JwtUserStrategy, JwtEmployeeStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
