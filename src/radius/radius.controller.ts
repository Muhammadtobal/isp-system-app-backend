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
import { FindAllUserRadiusDto } from './dto/find-all-user.dto';
import { CurrentUser } from 'src/shared/decorators/req.guard.decorate';
import { AuthUser } from 'src/shared/helpers';
import { UpdateGroupDto } from './dto/update-group.dto';
import { CreateNasDto } from './dto/create-nas.dto';
import { UpdateNasDto } from './dto/update-nas.dto';
import { FindAllNasDto } from './dto/find-all-nas.dto';
import { Permissions } from 'src/shared/decorators/permissions.decorator';
import { Operation } from 'src/shared/enums/operation..enum';
import { RadCheck } from './entities/ radcheck.entity';
import { RadReply } from './entities/radreply.entity';
import { NetworkRadius } from './entities/network-radius.entity';
import { GroupNetworkRadius } from './entities/group-network-radius';
import { RadGroupCheck } from './entities/radgroupcheck.entity';
import { RadUserGroup } from './entities/radusergroup.entity';
import { Nas } from './entities/nas.entity';

@Controller('radius')
export class RadiusController {
  constructor(private readonly radiusService: RadiusService) {}

  @Post('create-pppoe')
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(
    Operation.CREATE + RadCheck.name,
    Operation.CREATE + RadReply.name,
  )
  async createPppoeUser(@Body() dto: CreateUserDto) {
    const users = await this.radiusService.createRadiusUsers(dto, true);

    return users[0];
  }

  @Post('create-hotspot')
  @Permissions(
    Operation.CREATE + RadCheck.name,
    Operation.CREATE + RadReply.name,
  )
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
  @Permissions(Operation.GET + RadCheck.name, Operation.GET + RadReply.name)
  findOneUser(@Param('username') username: string) {
    return this.radiusService.findOneUser(username);
  }

  @Patch('update-user/:username')
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(
    Operation.UPDATE + RadCheck.name,
    Operation.UPDATE + RadReply.name,
  )
  updateUser(@Param('username') username: string, @Body() dto: UpdateUserDto) {
    return this.radiusService.updateUser(username, dto);
  }

  @Post('get-all-user-network')
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.GET + NetworkRadius.name)
  findAllUserNetwork(@Body() filter: FindAllUserRadiusDto) {
    return this.radiusService.findAllUserNetwork(filter);
  }

  @Delete('remove-user/:username')
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(
    Operation.DELETE + RadCheck.name,
    Operation.DELETE + RadReply.name,
  )
  removeUser(@Param('username') username: string) {
    return this.radiusService.removeUser(username);
  }

  @Post('get-all-group-network')
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.GET + GroupNetworkRadius.name)
  findAllGroupNetwork(@Body() filter: FindAllUserRadiusDto) {
    return this.radiusService.findAllGroupNetwork(filter);
  }

  @Post('create-group')
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(
    Operation.CREATE + RadGroupCheck.name,
    Operation.CREATE + RadGroupCheck.name,
  )
  createGroup(@Body() dto: CreateGroupDto) {
    return this.radiusService.createGroup(dto);
  }

  @Post('assign-group')
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.CREATE + RadUserGroup.name)
  assignGroup(@Body() dto: AssignGroupDto) {
    return this.radiusService.assignGroup(dto.username, dto.groupname);
  }

  @Delete('unassign-group/:username')
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.DELETE + RadUserGroup.name)
  unassignGroup(@Param('username') username: string) {
    return this.radiusService.unassignGroup(username);
  }

  @Get('get-one-group/:groupname')
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(
    Operation.GET + RadGroupCheck.name,
    Operation.GET + RadGroupCheck.name,
  )
  findOneGroup(@Param('groupname') groupname: string) {
    return this.radiusService.findOneGroup(groupname);
  }

  @Patch('update-group/:groupname')
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(
    Operation.UPDATE + RadGroupCheck.name,
    Operation.UPDATE + RadGroupCheck.name,
  )
  updateGroup(
    @Param('groupname') groupname: string,
    @Body() dto: UpdateGroupDto,
  ) {
    return this.radiusService.updateGroup(groupname, dto);
  }

  @Delete('remove-group/:groupname')
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(
    Operation.DELETE + RadGroupCheck.name,
    Operation.DELETE + RadGroupCheck.name,
  )
  removeGroup(@Param('groupname') groupname: string) {
    return this.radiusService.removeGroup(groupname);
  }

  @Post('create-nas')
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.CREATE + Nas.name)
  createNas(@Body() createNasDto: CreateNasDto) {
    return this.radiusService.createNas(createNasDto);
  }

  @Patch('update-nas/:id')
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.UPDATE + Nas.name)
  public update(@Param('id') id: number, @Body() updateNasDto: UpdateNasDto) {
    return this.radiusService.updateNas(id, updateNasDto);
  }

  @Get('get-one-nas/:id')
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.GET + Nas.name)
  public findOne(@Param('id') id: number) {
    return this.radiusService.findOneNas({ id });
  }

  @Post('get-all-nas')
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.GET + Nas.name)
  public findAllNas(@Body() filter: FindAllNasDto) {
    return this.radiusService.findAllNas(filter);
  }

  @Delete('remove-nas/:id')
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.DELETE + Nas.name)
  removeNas(@Param('id') id: number) {
    return this.radiusService.removeNas(id);
  }
}
