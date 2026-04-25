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

import { EmployeeNetworkService } from './employee-network.service';
import { CreateEmployeeNetworkDto } from './dto/create-employee-network.dto';
import { UpdateEmployeeNetworkDto } from './dto/update-employee-network.dto';
import { JwtAuthUserGuard } from 'src/auth/guards/jwt-auth-user.guard';
import { FindAllEmployeeNetworkDto } from './dto/find-all-employee-network.dto';
import { getUser } from 'src/shared/helpers';

@Controller('employee-network')
export class EmployeeNetworkController {
  constructor(
    private readonly employeeNetworkService: EmployeeNetworkService,
  ) {}

  @Post('create')
  @UseGuards(JwtAuthUserGuard)
  create(
    @Body() createEmployeeNetworkDto: CreateEmployeeNetworkDto,
    @Request() req: any,
  ) {
    const user = getUser(req.user);
    if (user.role !== 'admin') {
      createEmployeeNetworkDto.user_id = user.userId;
    }
    return this.employeeNetworkService.create(createEmployeeNetworkDto);
  }

  @Post('get-all')
  @UseGuards(JwtAuthUserGuard)
  findAll(@Body() filter: FindAllEmployeeNetworkDto) {
    return this.employeeNetworkService.findAll(filter);
  }

  @Get('get-one/:id')
  @UseGuards(JwtAuthUserGuard)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.employeeNetworkService.findOne({ id });
  }

  @Patch('update/:id')
  @UseGuards(JwtAuthUserGuard)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateEmployeeNetworkDto,
  ) {
    return this.employeeNetworkService.update(id, updateDto);
  }

  @Delete('remove/:id')
  @UseGuards(JwtAuthUserGuard)
  remove(@Param('id', ParseIntPipe) id: number) {
    this.employeeNetworkService.remove(id);
    return {
      done: true,
    };
  }
}
