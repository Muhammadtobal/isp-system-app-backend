import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { RadiusService } from './radius.service';

import { CreatePppoeUserDto } from './dto/create-pppoe-user.dto';
import { CreateHotspotUserDto } from './dto/create-hotspot-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { CreateGroupDto } from './dto/create-group.dto';
import { AssignGroupDto } from './dto/assign-group.dto';
import { JwtAuthSharedGuard } from 'src/auth/guards/jwt-auth-shared.guard';

@ApiTags('radius')
@Controller('radius')
export class RadiusController {
  constructor(private readonly radiusService: RadiusService) {}

  @Post('pppoe')
  @UseGuards(JwtAuthSharedGuard)
  createPppoeUser(@Body() dto: CreatePppoeUserDto) {
    return this.radiusService.createPppoeUser(dto);
  }

  @Post('hotspot')
  @UseGuards(JwtAuthSharedGuard)
  createHotspotUser(@Body() dto: CreateHotspotUserDto) {
    return this.radiusService.createHotspotUser(dto);
  }

  // @Patch('password')

  // changePassword(@Body() dto: ChangePasswordDto) {
  //   return this.radiusService.changePassword(dto.username, dto.password);
  // }

  // @Patch('plan')
  // @UseGuards(JwtAuthSharedGuard)
  // updatePlan(@Body() dto: UpdatePlanDto) {
  //   return this.radiusService.updatePlan(dto.username, dto.plan);
  // }

  // @Patch('disable/:username')
  // @UseGuards(JwtAuthSharedGuard)
  // disableUser(@Param('username') username: string) {
  //   return this.radiusService.disableUser(username);
  // }

  // @Delete(':username')
  // @UseGuards(JwtAuthSharedGuard)
  // deleteUser(@Param('username') username: string) {
  //   return this.radiusService.deleteUser(username);
  // }

  @Get('online')
  @UseGuards(JwtAuthSharedGuard)
  getOnlineUsers() {
    return this.radiusService.getOnlineUsers();
  }

  // @Get('usage/:username')
  // @UseGuards(JwtAuthSharedGuard)
  // getUserUsage(@Param('username') username: string) {
  //   return this.radiusService.getUserUsage(username);
  // }

  @Post('group')
  @UseGuards(JwtAuthSharedGuard)
  createGroup(@Body() dto: CreateGroupDto) {
    return this.radiusService.createGroup(dto);
  }

  @Post('group/assign')
  @UseGuards(JwtAuthSharedGuard)
  assignGroup(@Body() dto: AssignGroupDto) {
    return this.radiusService.assignGroup(dto.username, dto.groupname);
  }

  @Delete('group/:username')
  @UseGuards(JwtAuthSharedGuard)
  removeGroup(@Param('username') username: string) {
    return this.radiusService.removeGroup(username);
  }
  @Get('attributes')
  @UseGuards(JwtAuthSharedGuard)
  getRadiusAttributes() {
    return this.radiusService.getRadiusAttributes();
  }
}
