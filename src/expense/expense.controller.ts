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

@Controller('expense')
export class ExpenseController {
  constructor(private readonly expenseService: ExpenseService) {}

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
    return this.expenseService.findOne({ id });
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
}
