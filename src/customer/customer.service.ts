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
import { PlanService } from 'src/plan/plan.service';
import { RadiusService } from 'src/radius/radius.service';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
    private dataSource: DataSource,
    private readonly pointService: PointService,
    private readonly planService: PlanService,
    private readonly subscriptionService: SubscriptionService,
    private readonly radiusService: RadiusService,
  ) {}

  public async create(createCustomerDto: CreateCustomerDto) {
    const customer = this.customerRepository.create(createCustomerDto);
    const point = await this.pointService.findOne({
      id: createCustomerDto.point_id,
    });

    if (!point) {
      throw new BadRequestException('Point not found');
    }

    if (point.count_subscription >= point.max_subscription) {
      throw new BadRequestException('Max subscription reached');
    }
    const customerSaved = await this.customerRepository.save(createCustomerDto);
    await this.subscriptionService.create({
      plan_id: createCustomerDto.plan_id,
      point_id: createCustomerDto.point_id,
      customer_id: customerSaved.id,
      user_id: customerSaved.user_id,
      start_date: createCustomerDto.expire_date,
      expire_date: createCustomerDto.expire_date,
      radius_username: createCustomerDto.radius_username,
    });

    return customerSaved;
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
