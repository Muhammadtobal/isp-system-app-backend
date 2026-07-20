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
import { UpdateGroupDto } from './dto/update-group.dto';
import { CreateNasDto } from './dto/create-nas.dto';
import { UpdateNasDto } from './dto/update-nas.dto';
import { FindAllNasDto } from './dto/find-all-nas.dto';

@Controller('radius')
export class RadiusController {
  constructor(private readonly radiusService: RadiusService) {}

  @Post('create-pppoe')
  @UseGuards(JwtAuthSharedGuard)
  async createPppoeUser(@Body() dto: CreateUserDto) {
    const users = await this.radiusService.createRadiusUsers(dto, true);

    return users[0];
  }

  @Post('create-hotspot')
  @UseGuards(JwtAuthSharedGuard)
  async createHotspotUser(@Body() dto: CreateUserDto) {
    const users = await this.radiusService.createRadiusUsers(dto, false);

    return {
      count: users.length,
      users,
    };
  }

  // @Get('get-online-users')
  // @UseGuards(JwtAuthSharedGuard)
  // getOnlineUsers() {
  //   return this.radiusService.getOnlineUsers();
  // }

  @Get('attributes')
  @UseGuards(JwtAuthSharedGuard)
  getRadiusAttributes() {
    return this.radiusService.getRadiusAttributes();
  }

  @Get('get-one-user/:username')
  @UseGuards(JwtAuthSharedGuard)
  findOneUser(@Param('username') username: string) {
    return this.radiusService.findOneUser(username);
  }

  @Patch('update-user/:username')
  @UseGuards(JwtAuthSharedGuard)
  updateUser(@Param('username') username: string, @Body() dto: UpdateUserDto) {
    return this.radiusService.updateUser(username, dto);
  }

  @Post('get-all-user-network')
  @UseGuards(JwtAuthSharedGuard)
  findAllUserNetwork(@Body() filter: FindAllUserDto) {
    return this.radiusService.findAllUserNetwork(filter);
  }

  @Delete('remove-user/:username')
  @UseGuards(JwtAuthSharedGuard)
  removeUser(@Param('username') username: string) {
    return this.radiusService.removeUser(username);
  }

  @Post('get-all-group-network')
  @UseGuards(JwtAuthSharedGuard)
  findAllGroupNetwork(@Body() filter: FindAllUserDto) {
    return this.radiusService.findAllGroupNetwork(filter);
  }

  @Post('create-group')
  @UseGuards(JwtAuthSharedGuard)
  createGroup(@Body() dto: CreateGroupDto) {
    return this.radiusService.createGroup(dto);
  }

  @Post('assign-group')
  @UseGuards(JwtAuthSharedGuard)
  assignGroup(@Body() dto: AssignGroupDto) {
    return this.radiusService.assignGroup(dto.username, dto.groupname);
  }

  @Delete('unassign-group/:username')
  @UseGuards(JwtAuthSharedGuard)
  unassignGroup(@Param('username') username: string) {
    return this.radiusService.unassignGroup(username);
  }

  @Get('get-one-group/:groupname')
  @UseGuards(JwtAuthSharedGuard)
  findOneGroup(@Param('groupname') groupname: string) {
    return this.radiusService.findOneGroup(groupname);
  }

  @Patch('update-group/:groupname')
  @UseGuards(JwtAuthSharedGuard)
  updateGroup(
    @Param('groupname') groupname: string,
    @Body() dto: UpdateGroupDto,
  ) {
    return this.radiusService.updateGroup(groupname, dto);
  }

  @Delete('remove-group/:groupname')
  @UseGuards(JwtAuthSharedGuard)
  removeGroup(@Param('groupname') groupname: string) {
    return this.radiusService.removeGroup(groupname);
  }

  @Post('create-nas')
  @UseGuards(JwtAuthSharedGuard)
  createNas(@Body() createNasDto: CreateNasDto) {
    return this.radiusService.createNas(createNasDto);
  }

  @Patch('update-nas/:id')
  @UseGuards(JwtAuthSharedGuard)
  public update(@Param('id') id: number, @Body() updateNasDto: UpdateNasDto) {
    return this.radiusService.updateNas(id, updateNasDto);
  }

  @Get('get-one-nas/:id')
  @UseGuards(JwtAuthSharedGuard)
  public findOne(@Param('id') id: number) {
    return this.radiusService.findOneNas({ id });
  }

  @Post('get-all-nas')
  @UseGuards(JwtAuthSharedGuard)
  public findAllNas(@Body() filter: FindAllNasDto) {
    return this.radiusService.findAllNas(filter);
  }

  @Delete('remove-nas/:id')
  @UseGuards(JwtAuthSharedGuard)
  removeNas(@Param('id') id: number) {
    return this.radiusService.removeNas(id);
  }
}
