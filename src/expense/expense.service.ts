import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  FindOptionsRelations,
  FindOptionsSelect,
  FindOptionsWhere,
  Repository,
} from 'typeorm';

import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { Expense } from './entities/expense.entity';
import { FindAllExpenseDto } from './dto/find-all-expense.dto';

import {
  generateQueryConditions,
  generateQuerySorts,
  customPaginate,
} from 'src/shared/helpers';
import { PaginationMetadata } from 'src/shared/pagination-metadata';

@Injectable()
export class ExpenseService {
  constructor(
    @InjectRepository(Expense)
    private readonly expenseRepository: Repository<Expense>,
  ) {}

  public create(createExpenseDto: CreateExpenseDto) {
    const expense = this.expenseRepository.create(createExpenseDto);
    return this.expenseRepository.save(expense);
  }

  public findAll(filter: FindAllExpenseDto) {
    const query = this.expenseRepository
      .createQueryBuilder('expense')
      .where('true');

    generateQuerySorts<Expense>(query, filter, Expense, 'expense');
    generateQueryConditions<Expense>(query, filter, 'expense');

    return customPaginate<Expense, PaginationMetadata>(query, {
      limit: filter.pagination.limit,
      page: filter.pagination.page,
    });
  }

  public findOne(
    expenseOptions: FindOptionsWhere<Expense>,
    options?: {
      selected?: FindOptionsSelect<Expense>;
      relations?: FindOptionsRelations<Expense>;
    },
  ) {
    return this.expenseRepository.findOne({
      select: options?.selected,
      relations: options?.relations,
      where: expenseOptions,
    });
  }

  public async update(id: number, updateExpenseDto: UpdateExpenseDto) {
    await this.expenseRepository.update(id, updateExpenseDto);
    return this.findOne({ id });
  }

  public remove(id: number) {
    this.expenseRepository.delete(id);
  }
}
