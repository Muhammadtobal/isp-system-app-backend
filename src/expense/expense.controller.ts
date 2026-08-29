import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  Request,
} from '@nestjs/common';

import { ExpenseService } from './expense.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { FindAllExpenseDto } from './dto/find-all-expense.dto';
import { JwtAuthUserGuard } from 'src/auth/guards/jwt-auth-user.guard';
import { AuthUser } from 'src/shared/helpers';
import { Permissions } from 'src/shared/decorators/permissions.decorator';
import { Operation } from 'src/shared/enums/operation..enum';
import { Expense } from './entities/expense.entity';
import { JwtAuthEmployeeGuard } from 'src/auth/guards/jwt-auth-employee.guard';
import { JwtAuthSharedGuard } from 'src/auth/guards/jwt-auth-shared.guard';
import { CurrentUser } from 'src/shared/decorators/req.guard.decorate';
import { FindTotalExpenseDto } from './dto/find-total-expense.dto';
import { FindStatisticsDto } from 'src/point/dto/statistics.dto';
import { CurrencyService } from 'src/currency/currency.service';
import { number } from 'zod';

@Controller('expense')
export class ExpenseController {
  constructor(
    private readonly expenseService: ExpenseService,
    private readonly currencyService: CurrencyService,
  ) {}

  @Post('create')
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.CREATE + Expense.name)
  create(
    @Body() createExpenseDto: CreateExpenseDto,
    @CurrentUser() req: AuthUser,
  ) {
    const user = req;

    if (user.role !== 'admin') {
      createExpenseDto.user_id = user.userId;
    }

    return this.expenseService.create(createExpenseDto);
  }
  @Post('get-all')
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.GET + Expense.name)
  findAll(@Body() filter: FindAllExpenseDto) {
    return this.expenseService.findAll(filter);
  }

  @Get('get-one/:id')
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.CREATE + Expense.name)
  findOne(@Param('id') id: number) {
    return this.expenseService.findOne(
      { id },
      { relations: { currency: true } },
    );
  }

  @Patch('update/:id')
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.CREATE + Expense.name)
  update(@Param('id') id: number, @Body() updateExpenseDto: UpdateExpenseDto) {
    return this.expenseService.update(id, updateExpenseDto);
  }

  @Delete('remove/:id')
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.CREATE + Expense.name)
  remove(@Param('id') id: number) {
    this.expenseService.remove(id);
    return {
      done: true,
    };
  }

  @Post('expenses-total')
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.GET + 'Expense')
  public async expensesTotal(
    @Body() filter: FindTotalExpenseDto,
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

    const totalExpensesByCurrency = {};

    for (const curr of currency.items) {
      totalExpensesByCurrency[curr.id] = {
        currency_id: curr.id,
        currency: curr.code,
        totalExpenses: 0,
      };
    }

    const limit = 200;
    let page = 1;
    let lastPage = false;

    while (!lastPage) {
      const result = await this.expenseService.findAll({
        ...filter,
        pagination: { page, limit },
        user_id: user_id ? { value: Number(user_id) } : undefined,
      });

      if (!result.items.length) break;

      for (const exp of result.items) {
        if (!exp.currency_id) continue;

        if (!totalExpensesByCurrency[exp.currency_id]) {
          totalExpensesByCurrency[exp.currency_id] = {
            currency_id: exp.currency_id,
            currency: null,
            totalExpenses: 0,
          };
        }

        totalExpensesByCurrency[exp.currency_id].totalExpenses += Number(
          exp.value,
        );
      }

      if (result.items.length < limit) {
        lastPage = true;
      } else {
        page++;
      }
    }

    return {
      totalExpenses: Object.values(totalExpensesByCurrency),
    };
  }

  @Post('expenses-statistics')
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.GET + Expense.name)
  async expensesStatistics(
    @CurrentUser() req: AuthUser,
    @Body() filter: FindStatisticsDto,
  ) {
    const user = req;
    let user_id;

    if (user.role !== 'admin') {
      user_id = user.userId;
    }

    let totalExpenses = 0;
    let activeExpenses = 0;
    let inactiveExpenses = 0;

    const limit = 200;
    let page = 1;
    let lastPage = false;

    while (!lastPage) {
      const result = await this.expenseService.findAll({
        ...filter,
        pagination: { page, limit },
        user_id: { value: user_id },
      });

      if (!result.items.length) break;

      for (const e of result.items) {
        totalExpenses++;

        if (e.active) activeExpenses++;
        else inactiveExpenses++;
      }

      if (result.items.length < limit) {
        lastPage = true;
      } else {
        page++;
      }
    }

    return {
      totalExpenses,
      activeExpenses,
      inactiveExpenses,
    };
  }
}
