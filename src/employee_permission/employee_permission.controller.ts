import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EmployeePermissionService } from './employee_permission.service';
import { CreateEmployeePermissionDto } from './dto/create-employee_permission.dto';
import { UpdateEmployeePermissionDto } from './dto/update-employee_permission.dto';

@Controller('employee-permission')
export class EmployeePermissionController {
  constructor(private readonly employeePermissionService: EmployeePermissionService) {}

  @Post()
  create(@Body() createEmployeePermissionDto: CreateEmployeePermissionDto) {
    return this.employeePermissionService.create(createEmployeePermissionDto);
  }

  @Get()
  findAll() {
    return this.employeePermissionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.employeePermissionService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEmployeePermissionDto: UpdateEmployeePermissionDto) {
    return this.employeePermissionService.update(+id, updateEmployeePermissionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.employeePermissionService.remove(+id);
  }
}
