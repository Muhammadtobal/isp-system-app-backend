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

import { AlertService } from './alert.service';
import { CreateAlertDto } from './dto/create-alert.dto';
import { UpdateAlertDto } from './dto/update-alert.dto';
import { FindAllAlertDto } from './dto/find-all-alert.dto';

import { JwtAuthSharedGuard } from 'src/auth/guards/jwt-auth-shared.guard';

import { Permissions } from 'src/shared/decorators/permissions.decorator';
import { Operation } from 'src/shared/enums/operation..enum';

import { Alert } from './entities/alert.entity';
import { CurrentUser } from 'src/shared/decorators/req.guard.decorate';
import { AuthUser } from 'src/shared/helpers';

@Controller('alert')
export class AlertController {
  constructor(private readonly alertService: AlertService) {}

  @Post('create')
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.CREATE + Alert.name)
  public async create(
    @Body() createAlertDto: CreateAlertDto,

    @CurrentUser() req: AuthUser,
  ) {
    const user = req;

    if (user.role !== 'admin') {
      createAlertDto.user_id = user.userId;
    }
    await this.alertService.create(createAlertDto);
    return {
      done: true,
    };
  }

  @Post('get-all')
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.GET + Alert.name)
  public findAll(@Body() filter: FindAllAlertDto) {
    return this.alertService.findAll(filter);
  }

  @Get('get-one/:id')
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.GET + Alert.name)
  public findOne(@Param('id') id: number) {
    return this.alertService.findOne({ id });
  }

  @Patch('update/:id')
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.UPDATE + Alert.name)
  public update(
    @Param('id') id: number,
    @Body() updateAlertDto: UpdateAlertDto,
  ) {
    return this.alertService.update(id, updateAlertDto);
  }

  @Delete('remove/:id')
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.DELETE + Alert.name)
  public remove(@Param('id') id: number) {
    this.alertService.remove(id);

    return {
      done: true,
    };
  }
}
