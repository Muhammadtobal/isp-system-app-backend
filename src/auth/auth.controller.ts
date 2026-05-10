import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  Request,
} from '@nestjs/common';

import * as bcrypt from 'bcryptjs';

import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { decodeJwtToken, verifyJwtToken } from 'src/shared/jwt-verify-token';
import { UserService } from 'src/user/user.service';
import { EmployeeService } from 'src/employee/employee.service';
import { ErrorMessages } from 'src/shared/error-messages.object';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly employeeService: EmployeeService,
  ) {}

  @Post('user-login')
  async userLogin(@Body() loginUserDto: LoginDto) {
    const user = await this.userService.findOne({
      email: loginUserDto.email,
      active: true,
    });

    if (!user) {
      throw new HttpException(
        ErrorMessages.UNAUTHORIZED,
        HttpStatus.UNAUTHORIZED,
      );
    }

    if (!(await bcrypt.compare(loginUserDto.password, user.password)))
      throw new HttpException(
        ErrorMessages.DATA_CONFLICT,
        HttpStatus.UNAUTHORIZED,
      );

    const accessToken = await this.authService.generateJwtToken(
      {
        userId: user.id,
        role: user.role,
      },
      process.env.USER_JWT_KEY as string,
    );

    const { password, ...safeUser } = user;

    return {
      user: safeUser,
      access_token: accessToken,
    };
  }

  @Post('employee-login')
  async employeeLogin(@Body() loginEmployeeDto: LoginDto) {
    const employee = await this.employeeService.findOne(
      {
        email: loginEmployeeDto.email,
        active: true,
      },
      {
        relations: { employee_permissions: { permission: true } },
      },
    );

    if (!employee) {
      throw new HttpException(
        'لا يوجد حساب بهذه المعلومات',
        HttpStatus.UNAUTHORIZED,
      );
    }
    if (!(await bcrypt.compare(loginEmployeeDto.password, employee.password))) {
      throw new HttpException(
        ErrorMessages.DATA_CONFLICT,
        HttpStatus.UNAUTHORIZED,
      );
    }

    const accessToken = await this.authService.generateJwtToken(
      {
        empId: employee.id,
        userId: employee.user_id,
        role: 'employee',
      },
      process.env.EMPLOYEE_JWT_KEY as string,
    );

    const { password, ...safeEmployee } = employee;

    return {
      employee: safeEmployee,
      role: 'employee',
      access_token: accessToken,
      expires_in: 15 * 60,
    };
  }

  // // @Post('user-refresh-token')
  // async refreshUserToken(@Body() dto: RefreshTokenDto, @Request() req: any) {
  //   if (!req.headers.authorization) {
  //     throw new HttpException('UNAUTHORIZED', HttpStatus.UNAUTHORIZED);
  //   }

  //   const token = req.headers.authorization.split(' ')[1];

  //   let jwtData: any;

  //   try {
  //     jwtData = verifyJwtToken(token, process.env.USER_JWT_KEY!);
  //   } catch (err: any) {
  //     if (err.message === 'TOKEN_EXPIRED') {
  //       decodeJwtToken(token);

  //       jwtData = verifyJwtToken(token, process.env.USER_JWT_KEY!, true);
  //     } else {
  //       throw err;
  //     }
  //   }

  //   const user = await this.userService.findOne({
  //     id: jwtData.userId,
  //     refresh_token: dto.refresh_token,
  //   });

  //   if (!user) {
  //     throw new HttpException('USER_NOT_FOUND', HttpStatus.NOT_FOUND);
  //   }

  //   const accessToken = await this.authService.generateJwtToken(
  //     { userId: user.id },
  //     process.env.USER_JWT_KEY as string,
  //   );

  //   return {
  //     access_token: accessToken,
  //     expires_in: 15 * 60,
  //   };
  // }

  // @Post('employee-refresh-token')
  // async refreshEmployeeToken(
  //   @Body() dto: RefreshTokenDto,
  //   @Request() req: any,
  // ) {
  //   if (!req.headers.authorization) {
  //     throw new HttpException('UNAUTHORIZED', HttpStatus.UNAUTHORIZED);
  //   }

  //   const token = req.headers.authorization.split(' ')[1];

  //   let jwtData: any;

  //   try {
  //     jwtData = verifyJwtToken(token, process.env.EMPLOYEE_JWT_KEY!);
  //   } catch (err: any) {
  //     if (err.message === 'TOKEN_EXPIRED') {
  //       decodeJwtToken(token);

  //       jwtData = verifyJwtToken(token, process.env.EMPLOYEE_JWT_KEY!, true);
  //     } else {
  //       throw err;
  //     }
  //   }

  //   const employee = await this.employeeService.findOne({
  //     id: jwtData.empId,
  //     refresh_token: dto.refresh_token,
  //   });

  //   if (!employee) {
  //     throw new HttpException('EMPLOYEE_NOT_FOUND', HttpStatus.NOT_FOUND);
  //   }

  //   const accessToken = await this.authService.generateJwtToken(
  //     { empId: employee.id },
  //     process.env.EMPLOYEE_JWT_KEY as string,
  //   );

  //   return {
  //     access_token: accessToken,
  //     expires_in: 15 * 60,
  //   };
  // }
}
