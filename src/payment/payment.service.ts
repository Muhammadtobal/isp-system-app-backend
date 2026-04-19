import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  FindOptionsRelations,
  FindOptionsSelect,
  FindOptionsWhere,
  Repository,
} from 'typeorm';

import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { Payment } from './entities/payment.entity';
import { FindAllPaymentDto } from './dto/find-all-payment.dto';

import {
  generateQueryConditions,
  generateQuerySorts,
  customPaginate,
} from 'src/shared/helpers';
import { PaginationMetadata } from 'src/shared/pagination-metadata';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
  ) {}

  public create(createPaymentDto: CreatePaymentDto) {
    const payment = this.paymentRepository.create(createPaymentDto);
    return this.paymentRepository.save(payment);
  }

  public findAll(filter: FindAllPaymentDto) {
    const query = this.paymentRepository
      .createQueryBuilder('payment')
      .where('true');

    generateQuerySorts<Payment>(query, filter, Payment, 'payment');

    generateQueryConditions<Payment>(query, filter, 'payment');

    return customPaginate<Payment, PaginationMetadata>(query, {
      limit: filter.pagination.limit,
      page: filter.pagination.page,
    });
  }

  public findOne(
    paymentOptions: FindOptionsWhere<Payment>,
    options?: {
      selected?: FindOptionsSelect<Payment>;
      relations?: FindOptionsRelations<Payment>;
    },
  ) {
    return this.paymentRepository.findOne({
      select: options?.selected,
      relations: options?.relations,
      where: paymentOptions,
    });
  }

  public async update(id: number, updatePaymentDto: UpdatePaymentDto) {
    await this.paymentRepository.update(id, updatePaymentDto);
    return this.findOne({ id });
  }

  public remove(id: number) {
    this.paymentRepository.delete(id);
  }
}
