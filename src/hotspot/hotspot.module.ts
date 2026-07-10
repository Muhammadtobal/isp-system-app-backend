import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';

import { HotSpotService } from './hotspot.service';

import { HotSpotController } from './hotspot.controller';

import { HotspotProfile } from './entities/hotspot-profile.entity';

import { HotspotVoucher } from './entities/hotspot-voucher.entity';

import { RadiusModule } from 'src/radius/radius.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([HotspotProfile, HotspotVoucher]),

    RadiusModule,
  ],

  controllers: [HotSpotController],

  providers: [HotSpotService],

  exports: [HotSpotService],
})
export class HotspotModule {}
