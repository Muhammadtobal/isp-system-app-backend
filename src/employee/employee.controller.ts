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
import { EmployeeService } from './employee.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { FindAllEmployeeDto } from './dto/find-all-employee.dto';

@Controller('employee')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Post('create')
  create(@Body() createEmployeeDto: CreateEmployeeDto) {
    return this.employeeService.create(createEmployeeDto);
  }

  @Post('get-all')
  findAll(@Body() filter: FindAllEmployeeDto) {
    return this.employeeService.findAll(filter);
  }

  @Get('get-one/:id')
  findOne(@Param('id') id: number) {
    return this.employeeService.findOne({ id });
  }

  @Patch('update/:id')
  update(
    @Param('id') id: number,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
  ) {
    return this.employeeService.update(id, updateEmployeeDto);
  }

  @Delete('remove/:id')
  remove(@Param('id') id: number) {
    this.employeeService.remove(id);
    return {
      done: true,
    };
  }
}
