import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

import { PermissionService } from './permission.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { FindAllPermissionDto } from './dto/find-all-permission.dto';
import { JwtAuthUserGuard } from 'src/auth/guards/jwt-auth-user.guard';
import { Permissions } from 'src/shared/decorators/permissions.decorator';
import { Operation } from 'src/shared/enums/operation..enum';
import { Permission } from './entities/permission.entity';
import { JwtAuthSharedGuard } from 'src/auth/guards/jwt-auth-shared.guard';
import { CurrentUser } from 'src/shared/decorators/req.guard.decorate';
import { AuthUser } from 'src/shared/helpers';
import { ErrorMessages } from 'src/shared/error-messages.object';

@Controller('permission')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Post('create')
  @UseGuards(JwtAuthUserGuard)
  @Permissions(Operation.CREATE + Permission.name)
  public create(
    @Body() createPermissionDto: CreatePermissionDto,
    @CurrentUser() req: AuthUser,
  ) {
    const user = req;
    if (user.role !== 'admin') {
      throw new HttpException(
        ErrorMessages.NOT_ALLOWED,
        HttpStatus.UNAUTHORIZED,
      );
    }

    return this.permissionService.create(createPermissionDto);
  }

  @Post('get-all')
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.GET + Permission.name)
  public findAll(@Body() filter: FindAllPermissionDto) {
    return this.permissionService.findAll(filter);
  }

  @Get('get-one/:id')
  @UseGuards(JwtAuthSharedGuard)
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
    @CurrentUser() req: AuthUser,
  ) {
    const user = req;
    if (user.role !== 'admin') {
      throw new HttpException(
        ErrorMessages.NOT_ALLOWED,
        HttpStatus.UNAUTHORIZED,
      );
    }

    return this.permissionService.update(id, updatePermissionDto);
  }

  @Delete('remove/:id')
  @UseGuards(JwtAuthUserGuard)
  @Permissions(Operation.DELETE + Permission.name)
  public remove(@Param('id') id: number, @CurrentUser() req: AuthUser) {
    const user = req;
    if (user.role !== 'admin') {
      throw new HttpException(
        ErrorMessages.NOT_ALLOWED,
        HttpStatus.UNAUTHORIZED,
      );
    }
    this.permissionService.remove(id);
    return {
      done: true,
    };
  }
}
