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
import { CurrentUser } from 'src/shared/decorators/req.guard.decorate';
import { AuthUser } from 'src/shared/helpers';
import { Permissions } from 'src/shared/decorators/permissions.decorator';
import { Operation } from 'src/shared/enums/operation..enum';
import { EmployeeNetwork } from './entities/employee-network.entity';

@Controller('employee-network')
export class EmployeeNetworkController {
  constructor(
    private readonly employeeNetworkService: EmployeeNetworkService,
  ) {}

  @Post('create')
  @UseGuards(JwtAuthUserGuard)
  @Permissions(Operation.CREATE + EmployeeNetwork.name)
  create(
    @Body() createEmployeeNetworkDto: CreateEmployeeNetworkDto,
    @CurrentUser() req: AuthUser,
  ) {
    const user = req;
    if (user.role !== 'admin') {
      createEmployeeNetworkDto.user_id = user.userId;
    }
    return this.employeeNetworkService.create(createEmployeeNetworkDto);
  }

  @Post('get-all')
  @UseGuards(JwtAuthUserGuard)
  @Permissions(Operation.GET + EmployeeNetwork.name)
  findAll(@Body() filter: FindAllEmployeeNetworkDto) {
    return this.employeeNetworkService.findAll(filter);
  }

  @Get('get-one/:id')
  @UseGuards(JwtAuthUserGuard)
  @Permissions(Operation.GET + EmployeeNetwork.name)
  findOne(@Param('id') id: number) {
    return this.employeeNetworkService.findOne({ id });
  }

  @Patch('update/:id')
  @UseGuards(JwtAuthUserGuard)
  @Permissions(Operation.UPDATE + EmployeeNetwork.name)
  update(@Param('id') id: number, @Body() updateDto: UpdateEmployeeNetworkDto) {
    return this.employeeNetworkService.update(id, updateDto);
  }

  @Delete('remove/:id')
  @UseGuards(JwtAuthUserGuard)
  @Permissions(Operation.DELETE + EmployeeNetwork.name)
  remove(@Param('id') id: number) {
    this.employeeNetworkService.remove(id);
    return {
      done: true,
    };
  }
}
