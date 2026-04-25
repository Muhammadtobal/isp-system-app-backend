import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { FindAllCustomerDto } from './dto/find-all-customer.dto';
import { JwtAuthUserGuard } from 'src/auth/guards/jwt-auth-user.guard';
import { PointService } from 'src/point/point.service';
import { getUser } from 'src/shared/helpers';

@Controller('customer')
export class CustomerController {
  constructor(
    private readonly customerService: CustomerService,
    private readonly pointService: PointService,
  ) {}

  @Post('create')
  @UseGuards(JwtAuthUserGuard)
  public async create(
    @Body() createCustomerDto: CreateCustomerDto,
    @Request() req: any,
  ) {
    const user = getUser(req.user);
    if (user.role !== 'admin') {
      createCustomerDto.user_id = user.userId;
    }
    return this.customerService.create(createCustomerDto);
  }

  @Post('get-all')
  @UseGuards(JwtAuthUserGuard)
  public findAll(@Body() filter: FindAllCustomerDto) {
    return this.customerService.findAll(filter);
  }

  @Get('get-one/:id')
  @UseGuards(JwtAuthUserGuard)
  public findOne(@Param('id') id: number) {
    return this.customerService.findOne({ id });
  }

  @Patch('update/:id')
  @UseGuards(JwtAuthUserGuard)
  public update(
    @Param('id') id: number,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ) {
    return this.customerService.update(id, updateCustomerDto);
  }

  @Delete('remove/:id')
  @UseGuards(JwtAuthUserGuard)
  public remove(@Param('id') id: number) {
    this.customerService.remove(id);
    return {
      done: true,
    };
  }
}
