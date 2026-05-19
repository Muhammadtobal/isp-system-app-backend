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
} from '@nestjs/common';

import { ExpenseTypeService } from './expense_type.service';
import { CreateExpenseTypeDto } from './dto/create-expense_type.dto';
import { UpdateExpenseTypeDto } from './dto/update-expense_type.dto';
import { FindAllExpenseTypeDto } from './dto/find-all-expense-type.dto';
import { JwtAuthUserGuard } from 'src/auth/guards/jwt-auth-user.guard';
import { Permissions } from 'src/shared/decorators/permissions.decorator';
import { JwtAuthSharedGuard } from 'src/auth/guards/jwt-auth-shared.guard';
import { Operation } from 'src/shared/enums/operation..enum';
import { CurrentUser } from 'src/shared/decorators/req.guard.decorate';
import { AuthUser } from 'src/shared/helpers';

@Controller('expense-type')
export class ExpenseTypeController {
  constructor(private readonly expenseTypeService: ExpenseTypeService) {}

  @Post('create')
  @UseGuards(JwtAuthSharedGuard)
  create(
    @Body() createExpenseTypeDto: CreateExpenseTypeDto,
    @CurrentUser() req: AuthUser,
  ) {
    const user = req;

    if (user.role !== 'admin') {
      createExpenseTypeDto.user_id = user.userId;
    }

    return this.expenseTypeService.create(createExpenseTypeDto);
  }

  @Post('get-all')
  @UseGuards(JwtAuthSharedGuard)
  findAll(@Body() filter: FindAllExpenseTypeDto) {
    return this.expenseTypeService.findAll(filter);
  }

  @Get('get-one/:id')
  @UseGuards(JwtAuthSharedGuard)
  findOne(@Param('id') id: number) {
    return this.expenseTypeService.findOne({ id });
  }

  @Patch('update/:id')
  @UseGuards(JwtAuthSharedGuard)
  update(
    @Param('id') id: number,
    @Body() updateExpenseTypeDto: UpdateExpenseTypeDto,
  ) {
    return this.expenseTypeService.update(id, updateExpenseTypeDto);
  }

  @Delete('remove/:id')
  @UseGuards(JwtAuthSharedGuard)
  remove(@Param('id') id: number) {
    this.expenseTypeService.remove(id);
    return {
      done: true,
    };
  }

  @Get('expense-types-statistics')
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.GET + 'ExpenseType')
  public async expenseTypesStatistics() {
    let totalExpenseTypes = 0;
    let activeExpenseTypes = 0;
    let inactiveExpenseTypes = 0;

    const limit = 200;
    let page = 1;
    let lastPage = false;

    while (!lastPage) {
      const result = await this.expenseTypeService.findAll({
        pagination: { page, limit },
      });

      if (!result.items.length) break;

      for (const e of result.items) {
        totalExpenseTypes++;

        if (e.active) activeExpenseTypes++;
        else inactiveExpenseTypes++;
      }

      if (result.items.length < limit) {
        lastPage = true;
      } else {
        page++;
      }
    }

    return {
      totalExpenseTypes,
      activeExpenseTypes,
      inactiveExpenseTypes,
    };
  }
}
