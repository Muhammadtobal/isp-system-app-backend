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

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

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
  @UseGuards(JwtAuthUserGuard)
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.GET + Payment.name)
  public findOne(@Param('id') id: number) {
    return this.paymentService.findOne({ id });
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
  @UseGuards(JwtAuthUserGuard)
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

    let totalPayments = 0;
    let subscriptionsCount = 0;
    const limit = 200;
    let page = 1;
    let lastPage = false;

    while (!lastPage) {
      const result = await this.paymentService.findAll({
        ...filter,
        pagination: { page, limit },
        user_id: { value: user_id },
      });

      if (!result.items.length) break;

      for (const pay of result.items) {
        totalPayments += pay.amount;

        if (pay.subscription_id) {
          subscriptionsCount++;
        }
      }

      if (result.items.length < limit) {
        lastPage = true;
      } else {
        page++;
      }
    }

    return {
      totalPayments,
      subscriptionsCount,
    };
  }
}
