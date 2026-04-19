import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';

import { PermissionService } from './permission.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { FindAllPermissionDto } from './dto/find-all-permission.dto';

@Controller('permission')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Post('create')
  public create(@Body() createPermissionDto: CreatePermissionDto) {
    return this.permissionService.create(createPermissionDto);
  }

  @Post('get-all')
  public findAll(@Body() filter: FindAllPermissionDto) {
    return this.permissionService.findAll(filter);
  }

  @Get('get-one/:id')
  public findOne(@Param('id') id: number) {
    return this.permissionService.findOne({ id });
  }

  @Patch('update/:id')
  public update(
    @Param('id') id: number,
    @Body() updatePermissionDto: UpdatePermissionDto,
  ) {
    return this.permissionService.update(id, updatePermissionDto);
  }

  @Delete('remove/:id')
  public remove(@Param('id') id: number) {
    this.permissionService.remove(id);
    return {
      done: true,
    };
  }
}
