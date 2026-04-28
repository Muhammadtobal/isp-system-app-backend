import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';

import { PermissionService } from './permission.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { FindAllPermissionDto } from './dto/find-all-permission.dto';
import { JwtAuthUserGuard } from 'src/auth/guards/jwt-auth-user.guard';
import { Permissions } from 'src/shared/decorators/permissions.decorator';
import { Operation } from 'src/shared/enums/operation..enum';
import { Permission } from './entities/permission.entity';

@Controller('permission')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Post('create')
  @UseGuards(JwtAuthUserGuard)
  @Permissions(Operation.CREATE + Permission.name)
  public create(@Body() createPermissionDto: CreatePermissionDto) {
    return this.permissionService.create(createPermissionDto);
  }

  @Post('get-all')
  @UseGuards(JwtAuthUserGuard)
  @Permissions(Operation.GET + Permission.name)
  public findAll(@Body() filter: FindAllPermissionDto) {
    return this.permissionService.findAll(filter);
  }

  @Get('get-one/:id')
  @UseGuards(JwtAuthUserGuard)
  @Permissions(Operation.GET + Permission.name)
  public findOne(@Param('id') id: number) {
    return this.permissionService.findOne({ id });
  }

  @Patch('update/:id')
  @UseGuards(JwtAuthUserGuard)
  @Permissions(Operation.UPDATE + Permission.name)
  public update(
    @Param('id') id: number,
    @Body() updatePermissionDto: UpdatePermissionDto,
  ) {
    return this.permissionService.update(id, updatePermissionDto);
  }

  @Delete('remove/:id')
  @UseGuards(JwtAuthUserGuard)
  @Permissions(Operation.DELETE + Permission.name)
  public remove(@Param('id') id: number) {
    this.permissionService.remove(id);
    return {
      done: true,
    };
  }
}
