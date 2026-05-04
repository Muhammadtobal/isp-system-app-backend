import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DataSource,
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
import { SubscriptionService } from 'src/subscription/subscription.service';
import { PointService } from 'src/point/point.service';
import { Point } from 'src/point/entities/point.entity';
import { Subscription } from 'src/subscription/entities/subscription.entity';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
    private dataSource: DataSource,
  ) {}

  public async create(createCustomerDto: CreateCustomerDto) {
    return this.dataSource.transaction(async (manager) => {
      const customer = manager.create(Customer, createCustomerDto);
      const customerSaved = await manager.save(customer);

      const point = await manager.findOne(Point, {
        where: { id: createCustomerDto.point_id },
      });

      if (!point) {
        throw new BadRequestException('Point not found');
      }

      if (point.count_subscription >= point.max_subscription) {
        throw new BadRequestException('Max subscription reached');
      }

      const subscription = manager.create(Subscription, {
        plan_id: createCustomerDto.plan_id,
        point_id: createCustomerDto.point_id,
        customer_id: customerSaved.id,
        user_id: customerSaved.user_id,
      });

      await manager.save(subscription);

      await manager.increment(Point, { id: point.id }, 'count_subscription', 1);

      return customerSaved;
    });
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
