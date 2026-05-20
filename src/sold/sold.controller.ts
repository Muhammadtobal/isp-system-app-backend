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

import { SoldService } from './sold.service';
import { CreateSoldDto } from './dto/create-sold.dto';
import { UpdateSoldDto } from './dto/update-sold.dto';
import { FindAllSoldDto } from './dto/find-all-sold.dto';

import { JwtAuthUserGuard } from 'src/auth/guards/jwt-auth-user.guard';
import { JwtAuthSharedGuard } from 'src/auth/guards/jwt-auth-shared.guard';

import { Permissions } from 'src/shared/decorators/permissions.decorator';
import { Operation } from 'src/shared/enums/operation..enum';
import { CurrentUser } from 'src/shared/decorators/req.guard.decorate';

import { AuthUser } from 'src/shared/helpers';
import { Sold } from './entities/sold.entity';

@Controller('sold')
export class SoldController {
  constructor(private readonly soldService: SoldService) {}

  @Post('create')
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.CREATE + Sold.name)
  create(@Body() createSoldDto: CreateSoldDto, @CurrentUser() req: AuthUser) {
    const user = req;

    if (user.role !== 'admin') {
      createSoldDto.user_id = user.userId;
    }

    return this.soldService.create(createSoldDto);
  }

  @Post('get-all')
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.GET + Sold.name)
  findAll(@Body() filter: FindAllSoldDto) {
    return this.soldService.findAll(filter);
  }

  @Get('get-one/:id')
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.GET + Sold.name)
  findOne(@Param('id') id: number) {
    return this.soldService.findOne({ id });
  }

  @Patch('update/:id')
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.UPDATE + Sold.name)
  update(
    @Param('id') id: number,
    @Body() updateSoldDto: UpdateSoldDto,
    @CurrentUser() req: AuthUser,
  ) {
    const user = req;

    if (user.role !== 'admin') {
      updateSoldDto.user_id = user.userId;
    }
    return this.soldService.update(id, updateSoldDto);
  }

  @Delete('remove/:id')
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.DELETE + Sold.name)
  remove(@Param('id') id: number) {
    this.soldService.remove(id);
    return {
      done: true,
    };
  }

  @Get('sold-statistics')
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.GET + Sold.name)
  public async soldStatistics(@CurrentUser() req: AuthUser) {
    const user = req;

    let user_id;
    if (user.role !== 'admin') {
      user_id = user.userId;
    }

    let totalSold = 0;
    let activeSold = 0;
    let inactiveSold = 0;

    const limit = 200;
    let page = 1;
    let lastPage = false;

    while (!lastPage) {
      const result = await this.soldService.findAll({
        pagination: { page, limit },
        user_id: { value: Number(user_id) },
      });

      if (!result.items.length) break;

      for (const s of result.items) {
        totalSold++;

        if (s.active) activeSold++;
        else inactiveSold++;
      }

      if (result.items.length < limit) {
        lastPage = true;
      } else {
        page++;
      }
    }

    return {
      totalSold,
      activeSold,
      inactiveSold,
    };
  }
}
