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
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { FindAllPaymentDto } from './dto/find-all-payment.dto';
import { JwtAuthUserGuard } from 'src/auth/guards/jwt-auth-user.guard';
import { CurrentUser } from 'src/shared/decorators/req.guard.decorate';
import { AuthUser } from 'src/shared/helpers';
import { JwtAuthSharedGuard } from 'src/auth/guards/jwt-auth-shared.guard';
import { Permissions } from 'src/shared/decorators/permissions.decorator';
import { Operation } from 'src/shared/enums/operation..enum';
import { Payment } from './entities/payment.entity';
import { FindTotalPaymentDto } from './dto/find-total-payment.dto';
import { CurrencyService } from 'src/currency/currency.service';

@Controller('payment')
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly currencyService: CurrencyService,
  ) {}

  @Post('create')
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.CREATE + Payment.name)
  public create(
    @Body() createPaymentDto: CreatePaymentDto,
    @CurrentUser() req: AuthUser,
  ) {
    const user = req;
    if (user.role !== 'admin') {
      createPaymentDto.user_id = user.userId;
    }
    return this.paymentService.create(createPaymentDto);
  }

  @Post('get-all')
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.GET + Payment.name)
  public findAll(@Body() filter: FindAllPaymentDto) {
    return this.paymentService.findAll(filter);
  }

  @Get('get-one/:id')
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.GET + Payment.name)
  public findOne(@Param('id') id: number) {
    return this.paymentService.findOne(
      { id },
      { relations: { subscription: true, currency: true } },
    );
  }

  @Patch('update/:id')
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.UPDATE + Payment.name)
  public update(
    @Param('id') id: number,
    @Body() updatePaymentDto: UpdatePaymentDto,
  ) {
    return this.paymentService.update(id, updatePaymentDto);
  }

  @Delete('remove/:id')
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.DELETE + Payment.name)
  public remove(@Param('id') id: number) {
    this.paymentService.remove(id);
    return {
      done: true,
    };
  }

  @Post('payments-total')
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.GET + 'Payment')
  public async paymentsTotal(
    @Body() filter: FindTotalPaymentDto,
    @CurrentUser() req: AuthUser,
  ) {
    const user = req;

    let user_id;
    if (user.role !== 'admin') {
      user_id = user.userId;
    }

    const currency = await this.currencyService.findAll({
      pagination: {
        limit: 1000,
        page: 1,
      },
    });

    const totalPaymentsByCurrency = {};

    for (const curr of currency.items) {
      totalPaymentsByCurrency[curr.id] = {
        currency_id: curr.id,
        currency: curr.code,
        totalPayments: 0,
      };
    }

    const limit = 200;
    let page = 1;
    let lastPage = false;

    while (!lastPage) {
      const result = await this.paymentService.findAll({
        ...filter,
        pagination: { page, limit },
        user_id: user_id ? { value: Number(user_id) } : undefined,
      });

      if (!result.items.length) break;

      for (const pay of result.items) {
        if (!pay.currency_id) continue;

        if (!totalPaymentsByCurrency[pay.currency_id]) {
          totalPaymentsByCurrency[pay.currency_id] = {
            currency_id: pay.currency_id,
            currency: null,
            totalPayments: 0,
          };
        }

        totalPaymentsByCurrency[pay.currency_id].totalPayments += Number(
          pay.amount,
        );
      }

      if (result.items.length < limit) {
        lastPage = true;
      } else {
        page++;
      }
    }

    return {
      totalPayments: Object.values(totalPaymentsByCurrency),
    };
  }
}
