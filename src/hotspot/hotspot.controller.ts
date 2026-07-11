import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';

import { HotSpotService } from './hotspot.service';

import { CreateHotspotProfileDto } from './dto/create-profile.dto';
import { GenerateHotspotVoucherDto } from './dto/generate-voucher.dto';
import { FindAllHotspotProfileDto } from './dto/find-all-hotspot-profile.dto';
import { FindAllHotspotVoucherDto } from './dto/find-all-hotspot-voucher.dto';

@Controller('hotspot')
export class HotSpotController {
  constructor(private readonly hotSpotService: HotSpotService) {}

  // إنشاء بروفايل
  @Post('profile')
  createProfile(@Body() dto: CreateHotspotProfileDto) {
    return this.hotSpotService.createProfile(dto);
  }

  // عرض جميع البروفايلات
  //   @Get('profile')
  //   findAllProfiles() {
  //     return this.hotspotService.findAllProfiles();
  //   }

  //   // عرض بروفايل واحد
  //   @Get('profile/:id')
  //   findOneProfile(@Param('id', ParseIntPipe) id: number) {
  //     return this.hotspotService.findOneProfile(id);
  //   }

  // توليد بطاقات
  // @Post('generate')
  // generate(@Body() dto: GenerateHotspotVoucherDto) {
  //   return this.hotSpotService.generateVouchers(dto);
  // }

  @Post('get-all-hotSpot-profile')
  findAllHotSpotProfile(@Body() filter: FindAllHotspotProfileDto) {
    return this.hotSpotService.findAllHotspotProfile(filter);
  }

  @Post('get-all-hotSpot-voucher')
  findAllHotSpotVoucher(@Body() filter: FindAllHotspotVoucherDto) {
    return this.hotSpotService.findAllHotspotVoucher(filter);
  }
}
