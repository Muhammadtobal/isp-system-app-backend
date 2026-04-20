import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  UseGuards,
} from '@nestjs/common';

import * as bcrypt from 'bcryptjs';

import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { FindAllAdminDto } from './dto/find-all-admin.dto';

import { AuthService } from 'src/auth/auth.service';

@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly authService: AuthService,
  ) {}

  @Post('create')
  async create(@Body() createAdminDto: CreateAdminDto) {
    createAdminDto.password = await bcrypt.hash(createAdminDto.password, 10);

    const refreshToken = this.authService.generateRefreshToken();

    const admin = await this.adminService.create({
      ...createAdminDto,
      refresh_token: refreshToken,
    });

    return this.adminService.findOne({ id: admin.id });
  }

  @Post('get-all')
  findAll(@Body() filter: FindAllAdminDto) {
    return this.adminService.findAll(filter);
  }

  @Get('get-one/:id')
  findOne(@Param('id') id: number) {
    return this.adminService.findOne({ id });
  }

  @Patch('update/:id')
  update(@Param('id') id: number, @Body() updateAdminDto: UpdateAdminDto) {
    return this.adminService.update(id, updateAdminDto);
  }

  @Delete('remove/:id')
  remove(@Param('id') id: number) {
    this.adminService.remove(id);
    return {
      done: true,
    };
  }
}
