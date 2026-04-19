import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  FindOptionsRelations,
  FindOptionsSelect,
  FindOptionsWhere,
  Repository,
} from 'typeorm';

import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Customer } from './entities/customer.entity';
import { FindAllCustomerDto } from './dto/find-all-customer.dto';

import {
  generateQueryConditions,
  generateQuerySorts,
  customPaginate,
} from 'src/shared/helpers';
import { PaginationMetadata } from 'src/shared/pagination-metadata';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
  ) {}

  public create(createCustomerDto: CreateCustomerDto) {
    const customer = this.customerRepository.create(createCustomerDto);
    return this.customerRepository.save(customer);
  }

  public findAll(filter: FindAllCustomerDto) {
    const query = this.customerRepository
      .createQueryBuilder('customer')
      .where('true');

    generateQuerySorts<Customer>(query, filter, Customer, 'customer');

    generateQueryConditions<Customer>(query, filter, 'customer');

    return customPaginate<Customer, PaginationMetadata>(query, {
      limit: filter.pagination.limit,
      page: filter.pagination.page,
    });
  }

  public findOne(
    customerOptions: FindOptionsWhere<Customer>,
    options?: {
      selected?: FindOptionsSelect<Customer>;
      relations?: FindOptionsRelations<Customer>;
    },
  ) {
    return this.customerRepository.findOne({
      select: options?.selected,
      relations: options?.relations,
      where: customerOptions,
    });
  }

  public async update(id: number, updateCustomerDto: UpdateCustomerDto) {
    await this.customerRepository.update(id, updateCustomerDto);
    return this.findOne({ id });
  }

  public remove(id: number) {
    this.customerRepository.delete(id);
  }
}
