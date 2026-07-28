import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';

import { ConstantService } from './constant.service';
import { CreateConstantInput } from './dto/create-constant.dto';
import { UpdateConstantInput } from './dto/update-constant.dto';
import { FindAllConstantDto } from './dto/find-all-constant.dto';
import { JwtAuthEmployeeGuard } from 'src/auth/guards/jwt-auth-employee.guard';
import { Permissions } from 'src/shared/decorators/permissions.decorator';
import { Operation } from 'src/shared/enums/operation..enum';
import { Constant } from './entities/constant.entity';
import { JwtAuthUserGuard } from 'src/auth/guards/jwt-auth-user.guard';

@Controller('constant')
export class ConstantController {
  constructor(private readonly constantService: ConstantService) {}

  @Post('create')
  @UseGuards(JwtAuthUserGuard)
  @Permissions(Operation.CREATE + Constant.name)
  public create(@Body() createConstantDto: CreateConstantInput) {
    return this.constantService.create(createConstantDto);
  }

  @Get('get-all')
  public findAll() {
    return this.constantService.findAll(true);
  }

  @Get('get-one/:key')
  @UseGuards(JwtAuthUserGuard)
  @Permissions(Operation.GET + Constant.name)
  public findOne(@Param('key') key: string) {
    return this.constantService.findOne({ key });
  }

  @Patch('update')
  @UseGuards(JwtAuthUserGuard)
  @Permissions(Operation.UPDATE + Constant.name)
  public update(@Body() updateConstantDto: UpdateConstantInput) {
    return this.constantService.update(updateConstantDto);
  }

  @Delete('remove/:id')
  @UseGuards(JwtAuthUserGuard)
  @Permissions(Operation.DELETE + Constant.name)
  public async remove(@Param('id') id: string) {
    await this.constantService.remove(id);

    return {
      done: true,
    };
  }
}
