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
import { getUser } from 'src/shared/helpers';
import { Permissions } from 'src/shared/decorators/permissions.decorator';
import { Operation } from 'src/shared/enums/opration..enum';
import { Expense } from './entities/expense.entity';

@Controller('expense')
export class ExpenseController {
  constructor(private readonly expenseService: ExpenseService) {}

  @Post('create')
  @UseGuards(JwtAuthUserGuard)
  @Permissions(Operation.GET + Expense.name)
  create(@Body() createExpenseDto: CreateExpenseDto, @Request() req: any) {
    const user = getUser(req.user);
    if (user.role !== 'admin') {
      createExpenseDto.user_id = user.userId;
    }
    return this.expenseService.create(createExpenseDto);
  }

  @Post('get-all')
  @UseGuards(JwtAuthUserGuard)
  findAll(@Body() filter: FindAllExpenseDto) {
    return this.expenseService.findAll(filter);
  }

  @Get('get-one/:id')
  @UseGuards(JwtAuthUserGuard)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.expenseService.findOne({ id });
  }

  @Patch('update/:id')
  @UseGuards(JwtAuthUserGuard)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateExpenseDto: UpdateExpenseDto,
  ) {
    return this.expenseService.update(id, updateExpenseDto);
  }

  @Delete('remove/:id')
  @UseGuards(JwtAuthUserGuard)
  remove(@Param('id', ParseIntPipe) id: number) {
    this.expenseService.remove(id);
    return {
      done: true,
    };
  }
}
