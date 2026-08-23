import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  FindOptionsRelations,
  FindOptionsSelect,
  FindOptionsWhere,
  Repository,
} from 'typeorm';

import { Currency } from './entities/currency.entity';
import { ExchangeRate } from './entities/exchange_rate.entity';

import { CreateCurrencyDto } from './dto/create-currency.dto';
import { UpdateCurrencyDto } from './dto/update-currency.dto';
import { FindAllCurrencyDto } from './dto/find-all-currency.dt';

import { CreateExchangeRateDto } from './dto/create-exchange_rate.dto';
import { UpdateExchangeRateDto } from './dto/update-exchange_rate.dto';
import { FindAllExchangeRateDto } from './dto/find-all-exchange_rate.dto';

import {
  generateQueryConditions,
  generateQuerySorts,
  customPaginate,
} from 'src/shared/helpers';

import { PaginationMetadata } from 'src/shared/pagination-metadata';

@Injectable()
export class CurrencyService {
  constructor(
    @InjectRepository(Currency)
    private readonly currencyRepository: Repository<Currency>,

    @InjectRepository(ExchangeRate)
    private readonly exchangeRateRepository: Repository<ExchangeRate>,
  ) {}

  public async create(createCurrencyDto: CreateCurrencyDto) {
    const currency = this.currencyRepository.create(createCurrencyDto);

    return this.currencyRepository.save(currency);
  }

  public findAll(filter: FindAllCurrencyDto) {
    const query = this.currencyRepository
      .createQueryBuilder('currency')
      .where('true');

    generateQuerySorts<Currency>(query, filter, Currency, 'currency');

    generateQueryConditions<Currency>(query, filter, 'currency');

    return customPaginate<Currency, PaginationMetadata>(query, {
      limit: filter.pagination.limit,
      page: filter.pagination.page,
    });
  }

  public findOne(
    currencyOptions: FindOptionsWhere<Currency>,
    options?: {
      selected?: FindOptionsSelect<Currency>;
      relations?: FindOptionsRelations<Currency>;
    },
  ) {
    return this.currencyRepository.findOne({
      select: options?.selected,
      relations: options?.relations,
      where: currencyOptions,
    });
  }

  public async update(id: number, updateCurrencyDto: UpdateCurrencyDto) {
    await this.currencyRepository.update(id, updateCurrencyDto);

    return this.findOne({ id });
  }

  public remove(id: number) {
    return this.currencyRepository.delete(id);
  }

  public async createExchangeRate(
    createExchangeRateDto: CreateExchangeRateDto,
  ) {
    const currency = await this.currencyRepository.findOne({
      where: {
        id: createExchangeRateDto.currency_id,
      },
    });

    if (!currency) {
      throw new BadRequestException('Currency not found');
    }

    const toCurrency = await this.currencyRepository.findOne({
      where: {
        id: createExchangeRateDto.to_currency_id,
      },
    });

    if (!toCurrency) {
      throw new BadRequestException('To currency not found');
    }

    const exchangeRate = this.exchangeRateRepository.create(
      createExchangeRateDto,
    );

    return this.exchangeRateRepository.save(exchangeRate);
  }

  public findAllExchangeRate(filter: FindAllExchangeRateDto) {
    const query = this.exchangeRateRepository
      .createQueryBuilder('exchange_rate')
      .leftJoinAndSelect('exchange_rate.currency', 'currency')
      .leftJoinAndSelect('exchange_rate.to_currency', 'to_currency')

      .where('true');

    generateQuerySorts<ExchangeRate>(
      query,
      filter,
      ExchangeRate,
      'exchange_rate',
    );

    generateQueryConditions<ExchangeRate>(query, filter, 'exchange_rate');

    return customPaginate<ExchangeRate, PaginationMetadata>(query, {
      limit: filter.pagination.limit,
      page: filter.pagination.page,
    });
  }

  public findOneExchangeRate(
    exchangeRateOptions: FindOptionsWhere<ExchangeRate>,
    options?: {
      selected?: FindOptionsSelect<ExchangeRate>;
      relations?: FindOptionsRelations<ExchangeRate>;
    },
  ) {
    return this.exchangeRateRepository.findOne({
      select: options?.selected,
      relations: options?.relations,
      where: exchangeRateOptions,
    });
  }

  public async updateExchangeRate(
    id: number,
    updateExchangeRateDto: UpdateExchangeRateDto,
  ) {
    if (updateExchangeRateDto.currency_id) {
      const currency = await this.currencyRepository.findOne({
        where: {
          id: updateExchangeRateDto.currency_id,
        },
      });

      if (!currency) {
        throw new BadRequestException('Currency not found');
      }
    }

    if (updateExchangeRateDto.to_currency_id) {
      const toCurrency = await this.currencyRepository.findOne({
        where: {
          id: updateExchangeRateDto.to_currency_id,
        },
      });

      if (!toCurrency) {
        throw new BadRequestException('To currency not found');
      }
    }

    await this.exchangeRateRepository.update(id, updateExchangeRateDto);

    return this.findOneExchangeRate({ id });
  }

  public removeExchangeRate(id: number) {
    return this.exchangeRateRepository.delete(id);
  }
}
