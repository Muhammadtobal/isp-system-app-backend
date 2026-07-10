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
import { AuthUser } from 'src/shared/helpers';
import { CurrentUser } from 'src/shared/decorators/req.guard.decorate';
import { JwtAuthSharedGuard } from 'src/auth/guards/jwt-auth-shared.guard';
import { Permissions } from 'src/shared/decorators/permissions.decorator';
import { Operation } from 'src/shared/enums/operation..enum';
import { Customer } from './entities/customer.entity';

@Controller('customer')
export class CustomerController {
  constructor(
    private readonly customerService: CustomerService,
    private readonly pointService: PointService,
  ) {}

  @Post('create')
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.CREATE + Customer.name)
  public async create(
    @Body() createCustomerDto: CreateCustomerDto,
    @CurrentUser() req: AuthUser,
  ) {
    const user = req;
    if (user.role !== 'admin') {
      createCustomerDto.user_id = user.userId;
    }
    return this.customerService.create(createCustomerDto);
  }

  @Post('get-all')
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.GET + Customer.name)
  public findAll(@Body() filter: FindAllCustomerDto) {
    return this.customerService.findAll(filter);
  }

  @Get('get-one/:id')
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.GET + Customer.name)
  public findOne(@Param('id') id: number) {
    return this.customerService.findOne({ id });
  }

  @Patch('update/:id')
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.UPDATE + Customer.name)
  public update(
    @Param('id') id: number,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ) {
    return this.customerService.update(id, updateCustomerDto);
  }

  @Delete('remove/:id')
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.DELETE + Customer.name)
  public remove(@Param('id') id: number) {
    this.customerService.remove(id);
    return {
      done: true,
    };
  }

  @Get('customers-statistics')
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.GET + Customer.name)
  public async customersStatistics(@CurrentUser() req: AuthUser) {
    const user = req;
    let user_id;

    if (user.role !== 'admin') {
      user_id = user.userId;
    }

    let totalCustomers = 0;
    let activeCustomers = 0;
    let inactiveCustomers = 0;

    const limit = 200;
    let page = 1;
    let lastPage = false;

    while (!lastPage) {
      const result = await this.customerService.findAll({
        pagination: { page, limit },
        user_id: { value: Number(user_id) },
      });

      if (!result.items.length) break;

      for (const c of result.items) {
        totalCustomers++;

        if (c.active) activeCustomers++;
        else inactiveCustomers++;
      }

      if (result.items.length < limit) {
        lastPage = true;
      } else {
        page++;
      }
    }

    return {
      totalCustomers,
      activeCustomers,
      inactiveCustomers,
    };
  }
}
