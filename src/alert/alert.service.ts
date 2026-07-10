import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  FindOptionsRelations,
  FindOptionsSelect,
  FindOptionsWhere,
  Repository,
} from 'typeorm';

import { Alert } from './entities/alert.entity';

import { CreateAlertDto } from './dto/create-alert.dto';
import { UpdateAlertDto } from './dto/update-alert.dto';
import { FindAllAlertDto } from './dto/find-all-alert.dto';

import {
  generateQueryConditions,
  generateQuerySorts,
  customPaginate,
} from 'src/shared/helpers';

import { PaginationMetadata } from 'src/shared/pagination-metadata';
import { SubscriptionService } from 'src/subscription/subscription.service';
import { Subscription } from 'src/subscription/entities/subscription.entity';
import { Payment } from 'src/payment/entities/payment.entity';

@Injectable()
export class AlertService {
  constructor(
    @InjectRepository(Alert)
    private readonly alertRepository: Repository<Alert>,
    private readonly subscriptionService: SubscriptionService,
  ) {}

  public async create(createAlertDto: CreateAlertDto) {
    const queryRunner =
      this.alertRepository.manager.connection.createQueryRunner();

    await queryRunner.connect();

    await queryRunner.startTransaction();

    try {
      const lateSubscriptions = await queryRunner.manager
        .createQueryBuilder(Subscription, 'subscription')

        .leftJoin(
          (qb) =>
            qb
              .from(Payment, 'payment')
              .select('payment.subscription_id', 'subscription_id')
              .addSelect('MAX(payment.created_at)', 'last_payment_date')
              .groupBy('payment.subscription_id'),
          'last_payment',
          'last_payment.subscription_id = subscription.id',
        )

        .leftJoin(Alert, 'alert', 'alert.subscription_id = subscription.id')

        .select('subscription.id', 'subscription_id')
        .addSelect('subscription.user_id', 'user_id')
        .addSelect('last_payment.last_payment_date', 'last_payment_date')

        .where('subscription.user_id = :userId', {
          userId: createAlertDto.user_id,
        })

        .andWhere('alert.id IS NULL')

        .andWhere(
          `
    (
      last_payment.last_payment_date IS NULL
      OR last_payment.last_payment_date < DATE_SUB(NOW(), INTERVAL 30 DAY)
    )
  `,
        )

        .getRawMany();

      if (!lateSubscriptions.length) {
        await queryRunner.commitTransaction();
        return {
          done: true,
          created: 0,
        };
      }

      const alerts = lateSubscriptions.map((subscription) =>
        queryRunner.manager.create(Alert, {
          subscription_id: subscription.subscription_id,
          user_id: subscription.user_id,
        }),
      );

      await queryRunner.manager.save(Alert, alerts);

      await queryRunner.commitTransaction();

      return {
        done: true,
        created: alerts.length,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();

      throw error;
    } finally {
      await queryRunner.release();
    }
  }
  public findAll(filter: FindAllAlertDto) {
    const query = this.alertRepository
      .createQueryBuilder('alert')
      .leftJoinAndSelect('alert.subscription', 'subscription')

      .where('true');

    generateQuerySorts<Alert>(query, filter, Alert, 'alert');

    generateQueryConditions<Alert>(query, filter, 'alert');

    return customPaginate<Alert, PaginationMetadata>(query, {
      limit: filter.pagination.limit,
      page: filter.pagination.page,
    });
  }

  public findOne(
    alertOptions: FindOptionsWhere<Alert>,
    options?: {
      selected?: FindOptionsSelect<Alert>;
      relations?: FindOptionsRelations<Alert>;
    },
  ) {
    return this.alertRepository.findOne({
      select: options?.selected,
      relations: options?.relations,
      where: alertOptions,
    });
  }

  public async update(id: number, updateAlertDto: UpdateAlertDto) {
    await this.alertRepository.update(id, updateAlertDto);

    return this.findOne({ id });
  }

  public remove(id: number) {
    this.alertRepository.delete(id);
  }
}
