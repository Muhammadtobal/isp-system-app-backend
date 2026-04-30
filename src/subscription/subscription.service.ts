import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DataSource,
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
import { Point } from 'src/point/entities/point.entity';

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectRepository(Subscription)
    private readonly subscriptionRepository: Repository<Subscription>,
    private dataSource: DataSource,
  ) {}

  public async create(createSubscriptionDto: CreateSubscriptionDto) {
    return this.dataSource.transaction(async (manager) => {
      const point = await manager.findOne(Point, {
        where: { id: createSubscriptionDto.point_id },
      });

      if (!point) {
        throw new BadRequestException('Point not found');
      }

      if (point.count_subscription >= point.max_subscription) {
        throw new BadRequestException('Max subscription reached');
      }

      const subscription = manager.create(Subscription, createSubscriptionDto);
      const saved = await manager.save(subscription);

      await manager.increment(Point, { id: point.id }, 'count_subscription', 1);

      return saved;
    });
  }

  public findAll(filter: FindAllSubscriptionDto) {
    const query = this.subscriptionRepository
      .createQueryBuilder('subscription')
      .leftJoin('subscription.plan', 'plan')
      .leftJoin('subscription.point', 'point')
      .leftJoin('subscription.customer', 'customer')
      .select([
        'subscription',

        'plan.name',
        'plan.speed',
        'plan.price',

        'customer.name',

        'point.name',
      ])
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

  public async remove(id: number) {
    await this.dataSource.transaction(async (manager) => {
      const subscription = await manager.findOne(Subscription, {
        where: { id },
      });

      if (!subscription) {
        throw new NotFoundException('Subscription not found');
      }

      await manager.delete(Subscription, id);

      await manager.decrement(
        Point,
        { id: subscription.point_id },
        'count_subscription',
        1,
      );
    });
  }
}
