import { forwardRef, Module } from '@nestjs/common';
import { PlanService } from './plan.service';
import { PlanController } from './plan.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Plan } from './entities/plan.entity';
import { SubscriptionModule } from 'src/subscription/subscription.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Plan]),
    forwardRef(() => SubscriptionModule),
  ],
  exports: [PlanService],

  controllers: [PlanController],
  providers: [PlanService],
})
export class PlanModule {}
