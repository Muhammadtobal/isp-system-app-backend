import { forwardRef, Module } from '@nestjs/common';
import { AlertService } from './alert.service';
import { AlertController } from './alert.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Alert } from './entities/alert.entity';
import { SubscriptionModule } from 'src/subscription/subscription.module';
import { ConstantModule } from 'src/constant/constant.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Alert]),
    forwardRef(() => SubscriptionModule),
    ConstantModule,
  ],
  controllers: [AlertController],
  exports: [AlertService],
  providers: [AlertService],
})
export class AlertModule {}
