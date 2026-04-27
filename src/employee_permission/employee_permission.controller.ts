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

import { EmployeePermissionService } from './employee_permission.service';
import { CreateEmployeePermissionDto } from './dto/create-employee_permission.dto';
import { UpdateEmployeePermissionDto } from './dto/update-employee_permission.dto';
import { FindAllEmployeePermissionDto } from './dto/find-all-employee-permission.dto';
import { JwtAuthUserGuard } from 'src/auth/guards/jwt-auth-user.guard';

@Controller('employee-permission')
export class EmployeePermissionController {
  constructor(
    private readonly employeePermissionService: EmployeePermissionService,
  ) {}

  @Post('create')
  @UseGuards(JwtAuthUserGuard)
  public create(
    @Body() createEmployeePermissionDto: CreateEmployeePermissionDto,
  ) {
    return this.employeePermissionService.create(createEmployeePermissionDto);
  }

  @Post('get-all')
  @UseGuards(JwtAuthUserGuard)
  public findAll(@Body() filter: FindAllEmployeePermissionDto) {
    return this.employeePermissionService.findAll(filter);
  }

  @Get('get-one/:id')
  @UseGuards(JwtAuthUserGuard)
  public findOne(@Param('id') id: number) {
    return this.employeePermissionService.findOne({ id });
  }

  @Patch('update/:id')
  @UseGuards(JwtAuthUserGuard)
  public update(
    @Param('id') id: number,
    @Body() updateEmployeePermissionDto: UpdateEmployeePermissionDto,
  ) {
    return this.employeePermissionService.update(
      id,
      updateEmployeePermissionDto,
    );
  }
}
