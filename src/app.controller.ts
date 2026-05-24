import {
  Body,
  Controller,
  Get,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AppService } from './app.service';
import { JwtAuthUserGuard } from './auth/guards/jwt-auth-user.guard';
import { CurrentUser } from './shared/decorators/req.guard.decorate';
import { AuthUser } from './shared/helpers';
import { PlanService } from './plan/plan.service';
import { CustomerService } from './customer/customer.service';
import { SubscriptionService } from './subscription/subscription.service';
import { JwtAuthSharedGuard } from './auth/guards/jwt-auth-shared.guard';
import { ExpenseService } from './expense/expense.service';
import { PaymentService } from './payment/payment.service';
import { SoldService } from './sold/sold.service';
import { AnnualDto } from './shared/annual.dto';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly planService: PlanService,
    private readonly customerService: CustomerService,
    private readonly subscriptionService: SubscriptionService,
    private readonly expenseService: ExpenseService,
    private readonly paymentService: PaymentService,
    private readonly soldService: SoldService,
  ) {}

  @Get('general-statistics')
  @UseGuards(JwtAuthUserGuard)
  public async generalStatistics(
    @Body() filter: AnnualDto,
    @CurrentUser() req: AuthUser,
  ) {
    const user = req;

    let user_id;

    if (user.role !== 'admin') {
      user_id = user.userId;
    }

    const limit = 200;

    let activePlans = 0;
    let page = 1;
    let lastPage = false;

    while (!lastPage) {
      const result = await this.planService.findAll({
        ...filter,
        pagination: {
          page,
          limit,
        },
        user_id: {
          value: Number(user_id),
        },
        active: true,
      });

      if (!result.items.length) break;

      activePlans += result.items.length;

      if (result.items.length < limit) {
        lastPage = true;
      } else {
        page++;
      }
    }

    const plansWithSubscriptions =
      await this.subscriptionService.getPlansSubscribers(Number(user_id));

    let activeCustomers = 0;

    page = 1;
    lastPage = false;

    while (!lastPage) {
      const result = await this.customerService.findAll({
        ...filter,
        pagination: {
          page,
          limit,
        },
        user_id: {
          value: Number(user_id),
        },
        active: true,
      });

      if (!result.items.length) break;

      activeCustomers += result.items.length;

      if (result.items.length < limit) {
        lastPage = true;
      } else {
        page++;
      }
    }

    let activeSubscriptions = 0;

    page = 1;
    lastPage = false;

    while (!lastPage) {
      const result = await this.subscriptionService.findAll({
        ...filter,
        pagination: {
          page,
          limit,
        },
        user_id: {
          value: Number(user_id),
        },
        active: true,
      });

      if (!result.items.length) break;

      activeSubscriptions += result.items.length;

      if (result.items.length < limit) {
        lastPage = true;
      } else {
        page++;
      }
    }

    let totalExpenses = 0;

    page = 1;
    lastPage = false;

    while (!lastPage) {
      const result = await this.expenseService.findAll({
        ...filter,
        pagination: {
          page,
          limit,
        },
        user_id: {
          value: Number(user_id),
        },
      });

      if (!result.items.length) break;

      for (const exp of result.items) {
        totalExpenses += Number(exp.value || 0);
      }

      if (result.items.length < limit) {
        lastPage = true;
      } else {
        page++;
      }
    }

    let totalPayments = 0;

    page = 1;
    lastPage = false;

    while (!lastPage) {
      const result = await this.paymentService.findAll({
        ...filter,
        pagination: {
          page,
          limit,
        },
        user_id: {
          value: Number(user_id),
        },
      });

      if (!result.items.length) break;

      for (const pay of result.items) {
        totalPayments += Number(pay.amount || 0);
      }

      if (result.items.length < limit) {
        lastPage = true;
      } else {
        page++;
      }
    }

    let totalSold = 0;

    page = 1;
    lastPage = false;

    while (!lastPage) {
      const result = await this.soldService.findAll({
        ...filter,
        pagination: {
          page,
          limit,
        },
        user_id: {
          value: Number(user_id),
        },
      });

      if (!result.items.length) break;

      for (const sold of result.items) {
        totalSold += Number(sold.value || 0);
      }

      if (result.items.length < limit) {
        lastPage = true;
      } else {
        page++;
      }
    }
    const netProfit = totalPayments + totalSold - totalExpenses;

    return {
      activePlans,
      plansWithSubscriptions,
      activeCustomers,
      activeSubscriptions,
      totalSold,
      totalExpenses,
      totalPayments,
      netProfit,
    };
  }
  @Post('annual-statistics')
  @UseGuards(JwtAuthUserGuard)
  public async annualStatistics(
    @Body() filter: AnnualDto,
    @CurrentUser() req: AuthUser,
  ) {
    const user = req;

    let user_id;

    if (user.role !== 'admin') {
      user_id = user.userId;
    }

    const limit = 200;

    const statistics: Record<
      number,
      {
        month: number;
        activePlans: number;
        activeCustomers: number;
        activeSubscriptions: number;
      }
    > = {};

    for (let i = 1; i <= 12; i++) {
      statistics[i] = {
        month: i,
        activePlans: 0,
        activeCustomers: 0,
        activeSubscriptions: 0,
      };
    }

    let page = 1;
    let lastPage = false;

    while (!lastPage) {
      const result = await this.planService.findAll({
        ...filter,
        pagination: {
          page,
          limit,
        },
        user_id: {
          value: Number(user_id),
        },
        active: true,
      });

      if (!result.items.length) break;

      for (const item of result.items) {
        const month = new Date(item.created_at).getMonth() + 1;

        statistics[month].activePlans++;
      }

      if (result.items.length < limit) {
        lastPage = true;
      } else {
        page++;
      }
    }

    page = 1;
    lastPage = false;

    while (!lastPage) {
      const result = await this.customerService.findAll({
        ...filter,
        pagination: {
          page,
          limit,
        },
        user_id: {
          value: Number(user_id),
        },
        active: true,
      });

      if (!result.items.length) break;

      for (const item of result.items) {
        const month = new Date(item.created_at).getMonth() + 1;

        statistics[month].activeCustomers++;
      }

      if (result.items.length < limit) {
        lastPage = true;
      } else {
        page++;
      }
    }

    page = 1;
    lastPage = false;

    while (!lastPage) {
      const result = await this.subscriptionService.findAll({
        ...filter,
        pagination: {
          page,
          limit,
        },
        user_id: {
          value: Number(user_id),
        },
        active: true,
      });

      if (!result.items.length) break;

      for (const item of result.items) {
        const month = new Date(item.created_at).getMonth() + 1;

        statistics[month].activeSubscriptions++;
      }

      if (result.items.length < limit) {
        lastPage = true;
      } else {
        page++;
      }
    }

    return Object.values(statistics);
  }

  // @Post('upload/image')
  // @UseGuards(JwtAuthSharedGuard)
  // @UseInterceptors(MulterImageConfigInterceptor)
  // async uploadImages(@UploadedFiles() file: Express.Multer.File) {
  //   const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';

  //   const host = process.env.HOST || 'localhost';

  //   const port = process.env.PORT;

  //   const uploadFolder = process.env.DESTINATION || 'uploads';

  //   `${protocol}://${host}:${port}/${uploadFolder}/${file.filename}`;

  //   return { done: true };
  // }
}
