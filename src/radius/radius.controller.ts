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

import { CreateUserDto } from './dto/create-user.dto';
import { CreateGroupDto } from './dto/create-group.dto';
import { AssignGroupDto } from './dto/assign-group.dto';
import { JwtAuthSharedGuard } from 'src/auth/guards/jwt-auth-shared.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindAllUserDto } from './dto/find-all-user.dto';
import { CurrentUser } from 'src/shared/decorators/req.guard.decorate';
import { AuthUser } from 'src/shared/helpers';

@Controller('radius')
export class RadiusController {
  constructor(private readonly radiusService: RadiusService) {}

  @Post('create-pppoe')
  @UseGuards(JwtAuthSharedGuard)
  async createPppoeUser(@Body() dto: CreateUserDto) {
    const users = await this.radiusService.createRadiusUsers(dto);

    return users[0];
  }

  @Post('hotspot')
  @UseGuards(JwtAuthSharedGuard)
  async createHotspotUser(@Body() dto: CreateUserDto) {
    const users = await this.radiusService.createRadiusUsers(dto);

    return {
      count: users.length,
      users,
    };
  }

  @Get('online')
  @UseGuards(JwtAuthSharedGuard)
  getOnlineUsers() {
    return this.radiusService.getOnlineUsers();
  }

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

  @Post('find-all')
  @UseGuards(JwtAuthSharedGuard)
  findAll(@Body() filter: FindAllUserDto) {
    return this.radiusService.findAll(filter);
  }

  @Get('radius/:username')
  @UseGuards(JwtAuthSharedGuard)
  findOne(@Param('username') username: string) {
    return this.radiusService.findOne(username);
  }

  @Patch('radius/:username')
  @UseGuards(JwtAuthSharedGuard)
  update(@Param('username') username: string, @Body() dto: UpdateUserDto) {
    return this.radiusService.update(username, dto);
  }

  @Delete('radius/:username')
  @UseGuards(JwtAuthSharedGuard)
  remove(@Param('username') username: string) {
    return this.radiusService.remove(username);
  }

  @Post('find-all-user-network')
  @UseGuards(JwtAuthSharedGuard)
  findAllUserNetwork(@Body() filter: FindAllUserDto) {
    return this.radiusService.findAllUserNetwork(filter);
  }
}
