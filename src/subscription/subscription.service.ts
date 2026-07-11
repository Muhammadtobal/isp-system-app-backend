import {
  BadRequestException,
  HttpException,
  HttpStatus,
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
import { ErrorMessages } from 'src/shared/error-messages.object';
import { RadiusService } from 'src/radius/radius.service';
import { Plan } from 'src/plan/entities/plan.entity';
import { PointService } from 'src/point/point.service';
import { PlanService } from 'src/plan/plan.service';

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectRepository(Subscription)
    private readonly subscriptionRepository: Repository<Subscription>,
    private dataSource: DataSource,

    private readonly radiusService: RadiusService,
    private readonly pointService: PointService,
    private readonly planService: PlanService,
  ) {}

  public async create(createSubscriptionDto: CreateSubscriptionDto) {
    const point = await this.pointService.findOne({
      id: createSubscriptionDto.point_id,
    });
    if (!point) {
      throw new HttpException(
        ErrorMessages.POINT_NOT_FOUND,
        HttpStatus.BAD_REQUEST,
      );
    }

    if (point.count_subscription >= point.max_subscription) {
      throw new HttpException(
        ErrorMessages.MAX_SUBSCRIPTION_REACHED,
        HttpStatus.BAD_REQUEST,
      );
    }

    const subscription = this.subscriptionRepository.create(
      createSubscriptionDto,
    );
    const saved = await this.subscriptionRepository.save(subscription);

    await this.pointService.update(point.id, {
      count_subscription: point.count_subscription + 1,
    });
    const plan = await this.planService.findOne({
      id: createSubscriptionDto.plan_id,
    });
    if (!plan) return null;

    const username = `pppoe${saved.id}`;

    const password = Math.random().toString(36).slice(-8);

    // await this.radiusService.createPppoeUser(username, password, plan);
    saved.radius_username = username;

    return await this.subscriptionRepository.save(saved);
  }

  public async findAll(filter: FindAllSubscriptionDto) {
    const query = this.subscriptionRepository
      .createQueryBuilder('subscription')
      .leftJoin('subscription.plan', 'plan')
      .leftJoin('subscription.point', 'point')
      .leftJoin('subscription.customer', 'customer')
      .select([
        'subscription',

        'plan.name',
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

    const result = await customPaginate<Subscription, PaginationMetadata>(
      query,
      {
        limit: filter.pagination.limit,
        page: filter.pagination.page,
      },
    );

    const onlineUsers = await this.radiusService.getOnlineUsers();

    const onlineSet = new Set(onlineUsers.map((user) => user.username));

    result.items = result.items.map((subscription: any) => ({
      ...subscription,
      is_online: onlineSet.has(subscription.radius_username),
    }));

    return result;
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

  async getPlansSubscribers(user_id: number) {
    return this.subscriptionRepository
      .createQueryBuilder('subscription')
      .leftJoin('subscription.plan', 'plan')
      .select('plan.id', 'planId')
      .addSelect('plan.name', 'planName')
      .addSelect('COUNT(subscription.id)', 'count')
      .where(user_id ? 'subscription.user_id = :userId' : '1=1', {
        userId: user_id,
      })
      .groupBy('plan.id')
      .addGroupBy('plan.name')
      .getRawMany();
  }
}
