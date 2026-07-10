import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  Request,
} from '@nestjs/common';

import { PointService } from './point.service';
import { CreatePointDto } from './dto/create-point.dto';
import { UpdatePointDto } from './dto/update-point.dto';
import { FindAllPointDto } from './dto/find-all-point.dto';
import { JwtAuthUserGuard } from 'src/auth/guards/jwt-auth-user.guard';
import { CurrentUser } from 'src/shared/decorators/req.guard.decorate';
import { AuthUser } from 'src/shared/helpers';
import { JwtAuthSharedGuard } from 'src/auth/guards/jwt-auth-shared.guard';
import { Permissions } from 'src/shared/decorators/permissions.decorator';
import { Operation } from 'src/shared/enums/operation..enum';
import { Point } from './entities/point.entity';

@Controller('point')
export class PointController {
  constructor(private readonly pointService: PointService) {}

  @Post('create')
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.CREATE + Point.name)
  public create(
    @Body() createPointDto: CreatePointDto,
    @CurrentUser() req: AuthUser,
  ) {
    const user = req;
    if (user.role !== 'admin') {
      createPointDto.user_id = user.userId;
    }
    return this.pointService.create(createPointDto);
  }

  @Post('get-all')
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.GET + Point.name)
  public findAll(@Body() filter: FindAllPointDto) {
    return this.pointService.findAll(filter);
  }

  @Get('get-one/:id')
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.GET + Point.name)
  public findOne(@Param('id') id: number) {
    return this.pointService.findOne({ id });
  }

  @Patch('update/:id')
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.UPDATE + Point.name)
  public update(
    @Param('id') id: number,
    @Body() updatePointDto: UpdatePointDto,
  ) {
    return this.pointService.update(id, updatePointDto);
  }

  @Delete('remove/:id')
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.DELETE + Point.name)
  public remove(@Param('id') id: number) {
    this.pointService.remove(id);
    return {
      done: true,
    };
  }

  @Get('points-statistics')
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.GET + Point.name)
  async pointsStatistics(@CurrentUser() req: AuthUser) {
    const user = req;
    let user_id;
    if (user.role !== 'admin') {
      user_id = user.userId;
    }
    let totalPoints = 0;
    let activePoints = 0;
    let inactivePoints = 0;

    const limit = 200;
    let page = 1;
    let lastPage = false;

    while (!lastPage) {
      const result = await this.pointService.findAll({
        pagination: { page, limit },
        user_id: { value: Number(user_id) },
      });

      if (!result.items.length) break;

      for (const p of result.items) {
        totalPoints++;

        if (p.active) activePoints++;
        else inactivePoints++;
      }

      if (result.items.length < limit) {
        lastPage = true;
      } else {
        page++;
      }
    }

    return {
      totalPoints,
      activePoints,
      inactivePoints,
    };
  }
}
