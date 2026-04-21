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
import * as bcrypt from 'bcryptjs';

import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindAllUserDto } from './dto/find-all-user.dto';
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthUserGuard } from 'src/auth/guards/jwt-auth-user.guard';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post('create')
  public async create(@Body() createUserDto: CreateUserDto) {
    createUserDto.password = await bcrypt.hash(createUserDto.password, 10);

    const refreshToken = this.authService.generateRefreshToken();

    const user = await this.userService.create({
      ...createUserDto,
      refresh_token: refreshToken,
    });

    return this.userService.findOne({ id: user.id });
  }

  @Post('get-all')
  @UseGuards(JwtAuthUserGuard)
  public findAll(@Body() filter: FindAllUserDto) {
    return this.userService.findAll(filter);
  }

  @Get('get-one/:id')
  @UseGuards(JwtAuthUserGuard)
  public findOne(@Param('id') id: number) {
    return this.userService.findOne({ id });
  }

  @Patch('update/:id')
  @UseGuards(JwtAuthUserGuard)
  public update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete('remove/:id')
  @UseGuards(JwtAuthUserGuard)
  public remove(@Param('id') id: number) {
    this.userService.remove(id);
    return {
      done: true,
    };
  }
}
