import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { NetworkModule } from './network/network.module';
import { CustomerModule } from './customer/customer.module';
import { PlanModule } from './plan/plan.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { PaymentModule } from './payment/payment.module';
import { EmployeeModule } from './employee/employee.module';
import { EmployeePermissionModule } from './employee_permission/employee_permission.module';
import { PermissionModule } from './permission/permission.module';

@Module({
  imports: [UserModule, NetworkModule, CustomerModule, PlanModule, SubscriptionModule, PaymentModule, EmployeeModule, EmployeePermissionModule, PermissionModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
