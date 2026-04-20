import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';

import { EmployeePermissionService } from './employee_permission.service';
import { CreateEmployeePermissionDto } from './dto/create-employee_permission.dto';
import { UpdateEmployeePermissionDto } from './dto/update-employee_permission.dto';
import { FindAllEmployeePermissionDto } from './dto/find-all-employee-permission.dto';

@Controller('employee-permission')
export class EmployeePermissionController {
  constructor(
    private readonly employeePermissionService: EmployeePermissionService,
  ) {}

  @Post('create')
  public create(
    @Body() createEmployeePermissionDto: CreateEmployeePermissionDto,
  ) {
    return this.employeePermissionService.create(createEmployeePermissionDto);
  }

  @Post('get-all')
  public findAll(@Body() filter: FindAllEmployeePermissionDto) {
    return this.employeePermissionService.findAll(filter);
  }

  @Get('get-one/:id')
  public findOne(@Param('id') id: number) {
    return this.employeePermissionService.findOne({ id });
  }

  @Patch('update/:id')
  public update(
    @Param('id') id: number,
    @Body() updateEmployeePermissionDto: UpdateEmployeePermissionDto,
  ) {
    return this.employeePermissionService.update(
      id,
      updateEmployeePermissionDto,
    );
  }

  @Delete('remove/:id')
  public remove(@Param('id') id: number) {
    this.employeePermissionService.remove(id);
    return {
      done: true,
    };
  }
}
