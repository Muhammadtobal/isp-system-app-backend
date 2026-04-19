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
import { LoginUserDto } from './dto/login-user.dto';
// import { LoginAdminDto } from "./dto/login-admin.dto";
// import { AdminService } from "src/admin/admin.service";
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { decodeJwtToken, verifyJwtToken } from 'src/shared/jwt-verify-token';
import { UserService } from 'src/user/user.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    // private readonly adminService: AdminService,
  ) {}

  @Post('user-login')
  async userLogin(@Body() loginUserDto: LoginUserDto) {
    const user = await this.userService.findOne({
      email: loginUserDto.email,
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    if (!(await bcrypt.compare(loginUserDto.password, user.password)))
      throw new HttpException('UNAUTHORIZED', HttpStatus.UNAUTHORIZED);

    const accessToken = await this.authService.generateJwtToken(
      {
        userId: user.id,
      },
      process.env.USER_JWT_KEY as string,
    );

    const { password, ...safeUser } = user;

    return {
      user: safeUser,
      access_token: accessToken,
      expires_in: 15 * 60,
    };
  }

  // @Post("admin-login")
  // async adminLogin(@Body() loginAdminDto: LoginAdminDto) {
  //   const admin = await this.adminService.findOne({
  //     email: loginAdminDto.email,
  //   });

  //   if (!admin) {
  //     throw new HttpException("Admin not found", HttpStatus.NOT_FOUND);
  //   }

  //   const isMatch = await bcrypt.compare(
  //     loginAdminDto.password,
  //     admin.password,
  //   );

  //   if (!isMatch) {
  //     throw new HttpException("UNAUTHORIZED", HttpStatus.UNAUTHORIZED);
  //   }

  //   const accessToken = await this.authService.generateJwtToken(
  //     {
  //       adminId: admin.id,
  //     },
  //     process.env.ADMIN_JWT_KEY as string,
  //   );

  //   const { password, ...safeAdmin } = admin;

  //   return {
  //     admin: safeAdmin,
  //     access_token: accessToken,
  //     expires_in: 15 * 60,
  //   };
  // }

  // @Post("admin-refresh-token")
  // async refreshAdminToken(@Body() dto: RefreshTokenDto, @Request() req: any) {
  //   if (!req.headers.authorization) {
  //     throw new HttpException("UNAUTHORIZED", HttpStatus.UNAUTHORIZED);
  //   }

  //   const token = req.headers.authorization.split(" ")[1];

  //   let jwtData: any;

  //   try {
  //     jwtData = verifyJwtToken(token, process.env.ADMIN_JWT_KEY!);
  //   } catch (err: any) {
  //     if (err.message === "TOKEN_EXPIRED") {
  //       decodeJwtToken(token);

  //       jwtData = verifyJwtToken(token, process.env.ADMIN_JWT_KEY!, true);
  //     } else {
  //       throw err;
  //     }
  //   }

  //   const admin = await this.adminService.findOne({
  //     id: jwtData.adminId,
  //     refresh_token: dto.refresh_token,
  //   });

  //   if (!admin) {
  //     throw new HttpException("ADMIN_NOT_FOUND", HttpStatus.NOT_FOUND);
  //   }

  //   const accessToken = await this.authService.generateJwtToken(
  //     { adminId: admin.id },
  //     process.env.ADMIN_JWT_KEY as string,
  //   );

  //   return {
  //     access_token: accessToken,
  //     expires_in: 15 * 60,
  //   };
  // }

  @Post('user-refresh-token')
  async refreshUserToken(@Body() dto: RefreshTokenDto, @Request() req: any) {
    if (!req.headers.authorization) {
      throw new HttpException('UNAUTHORIZED', HttpStatus.UNAUTHORIZED);
    }

    const token = req.headers.authorization.split(' ')[1];

    let jwtData: any;

    try {
      jwtData = verifyJwtToken(token, process.env.USER_JWT_KEY!);
    } catch (err: any) {
      if (err.message === 'TOKEN_EXPIRED') {
        decodeJwtToken(token);

        jwtData = verifyJwtToken(token, process.env.USER_JWT_KEY!, true);
      } else {
        throw err;
      }
    }

    const user = await this.userService.findOne({
      id: jwtData.userId,
      refresh_token: dto.refresh_token,
    });

    if (!user) {
      throw new HttpException('USER_NOT_FOUND', HttpStatus.NOT_FOUND);
    }

    const accessToken = await this.authService.generateJwtToken(
      { userId: user.id },
      process.env.USER_JWT_KEY as string,
    );

    return {
      access_token: accessToken,
      expires_in: 15 * 60,
    };
  }
}
