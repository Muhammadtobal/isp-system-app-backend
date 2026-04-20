import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Req,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

import { EmployeeService } from './employee.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { FindAllEmployeeDto } from './dto/find-all-employee.dto';
import { AssignPermissionDto } from './dto/assign-permission.dto';
import { ResetMyPasswordDto } from './dto/reset-my-password.dto';
import { ErrorMessages } from 'src/shared/error-messages.object';
import { AuthService } from 'src/auth/auth.service';

@Controller('employee')
export class EmployeeController {
  constructor(
    private readonly employeeService: EmployeeService,
    private readonly authService: AuthService,
  ) {}

  @Post('create')
  public async createEmployee(@Body() createEmployeeDto: CreateEmployeeDto) {
    createEmployeeDto.password = await bcrypt.hash(
      createEmployeeDto.password,
      10,
    );

    const refreshToken = this.authService.generateRefreshToken();

    const employee = await this.employeeService.create({
      ...createEmployeeDto,
      refresh_token: refreshToken,
    });

    return this.employeeService.findOne({ id: employee.id });
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

  @Post('assign-permission')
  public async assignPermission(
    @Body() assignPermissionDto: AssignPermissionDto,
  ) {
    const result =
      await this.employeeService.assignPermission(assignPermissionDto);

    return { done: result };
  }

  @Post('unassign-permission')
  public async unassignPermission(
    @Body() unassignPermissionDto: AssignPermissionDto,
  ) {
    const result = await this.employeeService.unassignPermission(
      unassignPermissionDto,
    );

    return { done: result };
  }

  @Post('reset-my-password')
  public async resetMyPassword(
    @Body() resetMyPasswordDto: ResetMyPasswordDto,
    @Req() req: any,
  ) {
    const emp = await this.employeeService.findOne({
      id: req.user,
    });

    if (!emp)
      throw new HttpException(
        ErrorMessages.NOT_FOUND_EMPLOYEE,
        HttpStatus.NOT_FOUND,
      );

    if (
      !(await bcrypt.compare(resetMyPasswordDto.current_password, emp.password))
    )
      throw new HttpException(
        ErrorMessages.EMPLOYEE_DATA_CONFLICT,
        HttpStatus.CONFLICT,
      );

    const newHashedPassword = await bcrypt.hash(
      resetMyPasswordDto.new_password,
      10,
    );

    // await this.employeeService.update(id, { password: newHashedPassword });

    return { done: true };
  }
}
