import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  FindOptionsRelations,
  FindOptionsSelect,
  FindOptionsWhere,
  Repository,
} from 'typeorm';

import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { Subscription } from './entities/subscription.entity';
import { FindAllSubscriptionDto } from './dto/find-all-subscription.dto';

import {
  generateQueryConditions,
  generateQuerySorts,
  customPaginate,
} from 'src/shared/helpers';
import { PaginationMetadata } from 'src/shared/pagination-metadata';

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectRepository(Subscription)
    private readonly subscriptionRepository: Repository<Subscription>,
  ) {}

  public create(createSubscriptionDto: CreateSubscriptionDto) {
    const subscription = this.subscriptionRepository.create(
      createSubscriptionDto,
    );
    return this.subscriptionRepository.save(subscription);
  }

  public findAll(filter: FindAllSubscriptionDto) {
    const query = this.subscriptionRepository
      .createQueryBuilder('subscription')
      .where('true');

    generateQuerySorts<Subscription>(
      query,
      filter,
      Subscription,
      'subscription',
    );

    generateQueryConditions<Subscription>(query, filter, 'subscription');

    return customPaginate<Subscription, PaginationMetadata>(query, {
      limit: filter.pagination.limit,
      page: filter.pagination.page,
    });
  }

  public findOne(
    subscriptionOptions: FindOptionsWhere<Subscription>,
    options?: {
      selected?: FindOptionsSelect<Subscription>;
      relations?: FindOptionsRelations<Subscription>;
    },
  ) {
    return this.subscriptionRepository.findOne({
      select: options?.selected,
      relations: options?.relations,
      where: subscriptionOptions,
    });
  }

  public async update(
    id: number,
    updateSubscriptionDto: UpdateSubscriptionDto,
  ) {
    await this.subscriptionRepository.update(id, updateSubscriptionDto);
    return this.findOne({ id });
  }

  public remove(id: number) {
    this.subscriptionRepository.delete(id);
  }
}
