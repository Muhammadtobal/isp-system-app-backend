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
      const limit = 200;

      let page = 1;
      let lastPage = false;

      const alerts: Alert[] = [];

      while (!lastPage) {
        const result = await this.subscriptionService.findAll({
          pagination: { page, limit },
          user_id: { value: createAlertDto.user_id },
        });
        if (!result.items.length) break;

        for (const subscription of result.items) {
          const fullSubscription = await queryRunner.manager.findOne(
            Subscription,
            {
              where: { id: subscription.id },
              relations: {
                payments: true,
              },
            },
          );

          if (!fullSubscription) continue;

          if (!fullSubscription.payments?.length) continue;

          const lastPayment = fullSubscription.payments.sort(
            (a, b) =>
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime(),
          )[0];

          const lastPaymentDate = new Date(lastPayment.created_at);

          const now = new Date();

          const diffDays = Math.floor(
            (now.getTime() - lastPaymentDate.getTime()) / (1000 * 60 * 60 * 24),
          );

          if (diffDays > 30) {
            const exists = await queryRunner.manager.findOne(Alert, {
              where: {
                subscription_id: fullSubscription.id,
              },
            });

            if (exists) continue;

            const alert = queryRunner.manager.create(Alert, {
              subscription_id: fullSubscription.id,
              user_id: createAlertDto.user_id,
            });

            alerts.push(alert);
          }
        }

        if (result.items.length < limit) {
          lastPage = true;
        } else {
          page++;
        }
      }

      if (alerts.length) {
        await queryRunner.manager.save(Alert, alerts);
      }

      await queryRunner.commitTransaction();

      return {
        done: true,
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
