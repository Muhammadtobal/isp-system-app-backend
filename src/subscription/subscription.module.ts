import { Module } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { SubscriptionController } from './subscription.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subscription } from './entities/subscription.entity';
import { RadiusModule } from 'src/radius/radius.module';
import { PointModule } from 'src/point/point.module';
import { PlanModule } from 'src/plan/plan.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Subscription]),
    RadiusModule,
    PointModule,
    PlanModule,
  ],
  exports: [SubscriptionService],
  controllers: [SubscriptionController],
  providers: [SubscriptionService],
})
export class SubscriptionModule {}
