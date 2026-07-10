import { Module } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from './entities/customer.entity';
import { SubscriptionModule } from 'src/subscription/subscription.module';
import { PointModule } from 'src/point/point.module';
import { PlanModule } from 'src/plan/plan.module';
import { RadiusModule } from 'src/radius/radius.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Customer]),
    SubscriptionModule,
    PointModule,
    PlanModule,
    RadiusModule,
  ],
  exports: [CustomerService],
  controllers: [CustomerController],
  providers: [CustomerService],
})
export class CustomerModule {}
