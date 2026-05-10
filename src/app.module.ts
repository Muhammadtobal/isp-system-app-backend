import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

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
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { ExpenseModule } from './expense/expense.module';
import { ExpenseTypeModule } from './expense_type/expense_type.module';
import { PointModule } from './point/point.module';
import { EmployeeNetworkModule } from './employee-network/employee-network.module';
import { AlertModule } from './alert/alert.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: process.env.SYNC === 'true',
      logging: true,
    }),

    UserModule,
    NetworkModule,
    CustomerModule,
    PlanModule,
    SubscriptionModule,
    PaymentModule,
    EmployeeModule,
    EmployeePermissionModule,
    PermissionModule,
    AuthModule,
    ExpenseModule,
    ExpenseTypeModule,
    PointModule,
    EmployeeNetworkModule,
    AlertModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
