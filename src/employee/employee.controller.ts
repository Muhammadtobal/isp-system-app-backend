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
  UseGuards,
  Request,
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
import { JwtAuthUserGuard } from 'src/auth/guards/jwt-auth-user.guard';
import { getUser } from 'src/shared/helpers';

@Controller('employee')
export class EmployeeController {
  constructor(
    private readonly employeeService: EmployeeService,
    private readonly authService: AuthService,
  ) {}

  @Post('create')
  @UseGuards(JwtAuthUserGuard)
  public async createEmployee(
    @Body() createEmployeeDto: CreateEmployeeDto,
    @Request() req: any,
  ) {
    const user = getUser(req.user);
    if (user.role !== 'admin') {
      const exist = await this.employeeService.findOne({
        email: createEmployeeDto.email,
        user_id: user.userId,
      });

      if (exist) {
        throw new HttpException(
          '  المستخدم  موجود مسبقا',
          HttpStatus.NOT_FOUND,
        );
      }
      createEmployeeDto.user_id = user.userId;
    }
    createEmployeeDto.password = await bcrypt.hash(
      createEmployeeDto.password,
      10,
    );

    const employee = await this.employeeService.create({
      ...createEmployeeDto,
    });

    const saveEmp = await this.employeeService.findOne({ id: employee.id });
    if (!saveEmp) {
      throw new HttpException('المستخدم غير موجود', HttpStatus.NOT_FOUND);
    }

    const { password, ...safeEmp } = saveEmp;
    return safeEmp;
  }
  @Post('get-all')
  @UseGuards(JwtAuthUserGuard)
  async findAll(@Body() filter: FindAllEmployeeDto) {
    const employees = await this.employeeService.findAll(filter);

    const safeEmployees = employees.items.map((e) => {
      const { password, ...rest } = e;
      return rest;
    });

    return {
      ...employees,
      items: safeEmployees,
    };
  }

  @Get('get-one/:id')
  @UseGuards(JwtAuthUserGuard)
  public async findOne(@Param('id') id: number) {
    const employee = await this.employeeService.findOne({ id });

    if (!employee) {
      throw new HttpException('الموظف غير موجود', HttpStatus.NOT_FOUND);
    }

    const { password, ...employeeSafe } = employee;

    return employeeSafe;
  }

  @Patch('update/:id')
  @UseGuards(JwtAuthUserGuard)
  public async update(
    @Param('id') id: number,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
  ) {
    if (updateEmployeeDto.password) {
      updateEmployeeDto.password = await bcrypt.hash(
        updateEmployeeDto.password,
        10,
      );
    }

    const data = await this.employeeService.update(id, updateEmployeeDto);

    if (!data) {
      throw new HttpException('الموظف غير موجود', HttpStatus.NOT_FOUND);
    }

    const { password, ...safeEmployee } = data;

    return safeEmployee;
  }

  @Delete('remove/:id')
  @UseGuards(JwtAuthUserGuard)
  remove(@Param('id') id: number) {
    this.employeeService.remove(id);
    return {
      done: true,
    };
  }

  @Post('assign-permission')
  @UseGuards(JwtAuthUserGuard)
  public async assignPermission(
    @Body() assignPermissionDto: AssignPermissionDto,
  ) {
    const result =
      await this.employeeService.assignPermission(assignPermissionDto);

    return { done: result };
  }

  @Post('unassign-permission')
  @UseGuards(JwtAuthUserGuard)
  public async unassignPermission(
    @Body() unassignPermissionDto: AssignPermissionDto,
  ) {
    const result = await this.employeeService.unassignPermission(
      unassignPermissionDto,
    );

    return { done: result };
  }

  @Post('reset-my-password')
  @UseGuards(JwtAuthUserGuard)
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
