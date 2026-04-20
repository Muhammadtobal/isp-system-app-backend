import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';

import { PointService } from './point.service';
import { CreatePointDto } from './dto/create-point.dto';
import { UpdatePointDto } from './dto/update-point.dto';
import { FindAllPointDto } from './dto/find-all-point-type.dto';

@Controller('point')
export class PointController {
  constructor(private readonly pointService: PointService) {}

  @Post('create')
  create(@Body() createPointDto: CreatePointDto) {
    return this.pointService.create(createPointDto);
  }

  @Post('get-all')
  findAll(@Body() filter: FindAllPointDto) {
    return this.pointService.findAll(filter);
  }

  @Get('get-one/:id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.pointService.findOne({ id });
  }

  @Patch('update/:id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePointDto: UpdatePointDto,
  ) {
    return this.pointService.update(id, updatePointDto);
  }

  @Delete('remove/:id')
  remove(@Param('id', ParseIntPipe) id: number) {
    this.pointService.remove(id);
    return {
      done: true,
    };
  }
}
