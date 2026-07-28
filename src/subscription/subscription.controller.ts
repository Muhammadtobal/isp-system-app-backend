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
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { FindAllSubscriptionDto } from './dto/find-all-subscription.dto';
import { JwtAuthUserGuard } from 'src/auth/guards/jwt-auth-user.guard';
import { CurrentUser } from 'src/shared/decorators/req.guard.decorate';
import { AuthUser } from 'src/shared/helpers';
import { JwtAuthSharedGuard } from 'src/auth/guards/jwt-auth-shared.guard';
import { Permissions } from 'src/shared/decorators/permissions.decorator';
import { Operation } from 'src/shared/enums/operation..enum';
import { Subscription } from './entities/subscription.entity';
import { AlertService } from 'src/alert/alert.service';
import { PaymentService } from 'src/payment/payment.service';
import { ErrorMessages } from 'src/shared/error-messages.object';

@Controller('subscription')
export class SubscriptionController {
  constructor(
    private readonly subscriptionService: SubscriptionService,
    private readonly alertService: AlertService,
    private readonly paymentService: PaymentService,
  ) {}

  @Post('create')
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.CREATE + Subscription.name)
  public create(
    @Body() createSubscriptionDto: CreateSubscriptionDto,
    @CurrentUser() req: AuthUser,
  ) {
    const user = req;
    if (user.role !== 'admin') {
      createSubscriptionDto.user_id = user.userId;
    }
    return this.subscriptionService.create(createSubscriptionDto);
  }

  @Post('get-all')
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.GET + Subscription.name)
  public findAll(@Body() filter: FindAllSubscriptionDto) {
    return this.subscriptionService.findAll(filter);
  }

  @Get('get-one/:id')
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.GET + Subscription.name)
  public findOne(@Param('id') id: number) {
    return this.subscriptionService.findOne({ id });
  }

  @Patch('update/:id')
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.UPDATE + Subscription.name)
  public update(
    @Param('id') id: number,
    @Body() updateSubscriptionDto: UpdateSubscriptionDto,
  ) {
    return this.subscriptionService.update(id, updateSubscriptionDto);
  }

  @Delete('remove/:id')
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.DELETE + Subscription.name)
  public async remove(@Param('id') id: number) {
    const payment = await this.paymentService.findOne({ subscription_id: id });
    if (payment) {
      throw new HttpException(
        ErrorMessages.SUBSCRIPTION_HAS_PAYMENTS,
        HttpStatus.BAD_REQUEST,
      );
    }

    const alert = await this.alertService.findOne({ subscription_id: id });
    if (alert) {
      throw new HttpException(
        ErrorMessages.SUBSCRIPTION_HAS_NOTIFICATIONS,
        HttpStatus.BAD_REQUEST,
      );
    }
    this.subscriptionService.remove(id);
    return {
      done: true,
    };
  }

  @Get('subscriptions-statistics')
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.GET + Subscription.name)
  async subscriptionsStatistics(@CurrentUser() req: AuthUser) {
    const user = req;
    let user_id;

    if (user.role !== 'admin') {
      user_id = user.userId;
    }

    let totalSubscriptions = 0;
    let activeSubscriptions = 0;
    let inactiveSubscriptions = 0;

    const limit = 200;
    let page = 1;
    let lastPage = false;

    while (!lastPage) {
      const result = await this.subscriptionService.findAll({
        pagination: { page, limit },
        user_id: { value: Number(user_id) },
      });

      if (!result.items.length) break;

      for (const s of result.items) {
        totalSubscriptions++;

        if (s.active) activeSubscriptions++;
        else inactiveSubscriptions++;
      }

      if (result.items.length < limit) {
        lastPage = true;
      } else {
        page++;
      }
    }

    return {
      totalSubscriptions,
      activeSubscriptions,
      inactiveSubscriptions,
    };
  }
}
