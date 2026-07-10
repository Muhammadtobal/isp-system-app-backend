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
import { CurrentUser } from 'src/shared/decorators/req.guard.decorate';
import { AuthUser } from 'src/shared/helpers';
import { Permissions } from 'src/shared/decorators/permissions.decorator';
import { Operation } from 'src/shared/enums/operation..enum';
import { Employee } from './entities/employee.entity';
import { JwtAuthSharedGuard } from 'src/auth/guards/jwt-auth-shared.guard';
import { JwtAuthEmployeeGuard } from 'src/auth/guards/jwt-auth-employee.guard';

@Controller('employee')
export class EmployeeController {
  constructor(
    private readonly employeeService: EmployeeService,
    private readonly authService: AuthService,
  ) {}

  @Post('create')
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.CREATE + Employee.name)
  public async createEmployee(
    @Body() createEmployeeDto: CreateEmployeeDto,
    @CurrentUser() req: AuthUser,
  ) {
    const user = req;
    if (user.role !== 'admin') {
      const exist = await this.employeeService.findOne({
        email: createEmployeeDto.email,
        user_id: user.userId,
      });

      if (exist) {
        throw new HttpException(
          ErrorMessages.USER_EXISTS_CONFLICT,
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
      throw new HttpException(
        ErrorMessages.NOT_FOUND_EMPLOYEE,
        HttpStatus.NOT_FOUND,
      );
    }

    const { password, ...safeEmp } = saveEmp;
    return safeEmp;
  }
  @Post('get-all')
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.GET + Employee.name)
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
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.GET + Employee.name)
  public async findOne(@Param('id') id: number) {
    const employee = await this.employeeService.findOne(
      { id },
      {
        relations: {
          employee_permissions: { permission: true },
          employee_networks: { network: true },
        },
      },
    );

    if (!employee) {
      throw new HttpException(
        ErrorMessages.NOT_FOUND_EMPLOYEE,
        HttpStatus.NOT_FOUND,
      );
    }

    const { password, ...employeeSafe } = employee;

    return employeeSafe;
  }

  @Patch('update/:id')
  @UseGuards(JwtAuthUserGuard)
  @Permissions(Operation.UPDATE + Employee.name)
  @UseGuards(JwtAuthSharedGuard)
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
      throw new HttpException(
        ErrorMessages.NOT_FOUND_EMPLOYEE,
        HttpStatus.NOT_FOUND,
      );
    }

    const { password, ...safeEmployee } = data;

    return safeEmployee;
  }

  @Delete('remove/:id')
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.DELETE + Employee.name)
  @UseGuards(JwtAuthUserGuard)
  remove(@Param('id') id: number) {
    this.employeeService.remove(id);
    return {
      done: true,
    };
  }

  @Post('assign-permission')
  @UseGuards(JwtAuthSharedGuard)
  public async assignPermission(
    @Body() assignPermissionDto: AssignPermissionDto,
    @CurrentUser() req: AuthUser,
  ) {
    const user = req;
    if (user.role !== 'admin') {
      assignPermissionDto.user_id = user.userId;
    }

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
      throw new HttpException(ErrorMessages.DATA_CONFLICT, HttpStatus.CONFLICT);

    const newHashedPassword = await bcrypt.hash(
      resetMyPasswordDto.new_password,
      10,
    );

    // await this.employeeService.update(id, { password: newHashedPassword });

    return { done: true };
  }

  @Get('employees-statistics')
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.GET + Employee.name)
  async employeesStatistics(@CurrentUser() req: AuthUser) {
    const user = req;
    let user_id;

    if (user.role !== 'admin') {
      user_id = user.userId;
    }

    let totalEmployees = 0;
    let activeEmployees = 0;
    let inactiveEmployees = 0;

    const limit = 200;
    let page = 1;
    let lastPage = false;

    while (!lastPage) {
      const result = await this.employeeService.findAll({
        pagination: { page, limit },
        user_id: { value: Number(user_id) },
      });

      if (!result.items.length) break;

      for (const e of result.items) {
        totalEmployees++;

        if (e.active) activeEmployees++;
        else inactiveEmployees++;
      }

      if (result.items.length < limit) {
        lastPage = true;
      } else {
        page++;
      }
    }

    return {
      totalEmployees,
      activeEmployees,
      inactiveEmployees,
    };
  }
}
