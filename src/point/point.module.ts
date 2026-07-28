import { forwardRef, Module } from '@nestjs/common';
import { PointService } from './point.service';
import { PointController } from './point.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Point } from './entities/point.entity';
import { SubscriptionModule } from 'src/subscription/subscription.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Point]),
    forwardRef(() => SubscriptionModule),
  ],
  exports: [PointService],
  controllers: [PointController],
  providers: [PointService],
})
export class PointModule {}
