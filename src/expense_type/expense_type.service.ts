import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  FindOptionsRelations,
  FindOptionsSelect,
  FindOptionsWhere,
  Repository,
} from 'typeorm';

import { CreateExpenseTypeDto } from './dto/create-expense_type.dto';
import { UpdateExpenseTypeDto } from './dto/update-expense_type.dto';
import { ExpenseType } from './entities/expense_type.entity';
import { FindAllExpenseTypeDto } from './dto/find-all-expense-type.dto';

import {
  generateQueryConditions,
  generateQuerySorts,
  customPaginate,
} from 'src/shared/helpers';
import { PaginationMetadata } from 'src/shared/pagination-metadata';

@Injectable()
export class ExpenseTypeService {
  constructor(
    @InjectRepository(ExpenseType)
    private readonly expenseTypeRepository: Repository<ExpenseType>,
  ) {}

  public create(createExpenseTypeDto: CreateExpenseTypeDto) {
    const expenseType = this.expenseTypeRepository.create(createExpenseTypeDto);
    return this.expenseTypeRepository.save(expenseType);
  }

  public findAll(filter: FindAllExpenseTypeDto) {
    const query = this.expenseTypeRepository
      .createQueryBuilder('expenseType')
      .where('true');

    generateQuerySorts<ExpenseType>(query, filter, ExpenseType, 'expenseType');
    generateQueryConditions<ExpenseType>(query, filter, 'expenseType');

    return customPaginate<ExpenseType, PaginationMetadata>(query, {
      limit: filter.pagination.limit,
      page: filter.pagination.page,
    });
  }

  public findOne(
    expenseTypeOptions: FindOptionsWhere<ExpenseType>,
    options?: {
      selected?: FindOptionsSelect<ExpenseType>;
      relations?: FindOptionsRelations<ExpenseType>;
    },
  ) {
    return this.expenseTypeRepository.findOne({
      select: options?.selected,
      relations: options?.relations,
      where: expenseTypeOptions,
    });
  }

  public async update(id: number, updateExpenseTypeDto: UpdateExpenseTypeDto) {
    await this.expenseTypeRepository.update(id, updateExpenseTypeDto);
    return this.findOne({ id });
  }

  public remove(id: number) {
    this.expenseTypeRepository.delete(id);
  }
}
