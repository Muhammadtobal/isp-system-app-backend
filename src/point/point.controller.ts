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
} from '@nestjs/common';

import { PointService } from './point.service';
import { CreatePointDto } from './dto/create-point.dto';
import { UpdatePointDto } from './dto/update-point.dto';
import { FindAllPointDto } from './dto/find-all-point-type.dto';
import { JwtAuthUserGuard } from 'src/auth/guards/jwt-auth-user.guard';

@Controller('point')
export class PointController {
  constructor(private readonly pointService: PointService) {}

  @Post('create')
  @UseGuards(JwtAuthUserGuard)
  create(@Body() createPointDto: CreatePointDto) {
    return this.pointService.create(createPointDto);
  }

  @Post('get-all')
  @UseGuards(JwtAuthUserGuard)
  findAll(@Body() filter: FindAllPointDto) {
    return this.pointService.findAll(filter);
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
