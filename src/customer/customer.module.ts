import { Module } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from './entities/customer.entity';
import { SubscriptionModule } from 'src/subscription/subscription.module';
import { PointModule } from 'src/point/point.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Customer]),
    SubscriptionModule,
    PointModule,
  ],
  exports: [CustomerService],
  controllers: [CustomerController],
  providers: [CustomerService],
})
export class CustomerModule {}
