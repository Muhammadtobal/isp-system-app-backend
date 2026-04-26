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
import { getUser } from 'src/shared/helpers';

@Controller('point')
export class PointController {
  constructor(private readonly pointService: PointService) {}

  @Post('create')
  @UseGuards(JwtAuthUserGuard)
  create(@Body() createPointDto: CreatePointDto, @Request() req: any) {
    const user = getUser(req.user);
    if (user.role !== 'admin') {
      createPointDto.user_id = user.userId;
    }
    return this.pointService.create(createPointDto);
  }

  @Post('get-all')
  @UseGuards(JwtAuthUserGuard)
  async findAll(@Body() filter: FindAllPointDto) {
    const points = await this.pointService.findAll(filter);

    let activeCount = 0;
    let inactiveCount = 0;

    points.items.forEach((p) => {
      if (p.active) activeCount++;
      else inactiveCount++;
    });

    return {
      totalPoints: points.items.length,
      activePoints: activeCount,
      inactivePoints: inactiveCount,
      data: points,
    };
  }

  @Get('get-one/:id')
  @UseGuards(JwtAuthUserGuard)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.pointService.findOne({ id });
  }

  @Patch('update/:id')
  @UseGuards(JwtAuthUserGuard)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePointDto: UpdatePointDto,
  ) {
    return this.pointService.update(id, updatePointDto);
  }

  @Delete('remove/:id')
  @UseGuards(JwtAuthUserGuard)
  remove(@Param('id', ParseIntPipe) id: number) {
    this.pointService.remove(id);
    return {
      done: true,
    };
  }
}
