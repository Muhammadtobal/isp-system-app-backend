import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  FindOptionsRelations,
  FindOptionsSelect,
  FindOptionsWhere,
  Repository,
} from 'typeorm';

import { CreateDomainDto } from './dto/create-domain.dto';
import { UpdateDomainDto } from './dto/update-domain.dto';
import { FindAllDomainDto } from './dto/find-all-domain.dto';

import { Domain } from './entities/domain.entity';

import {
  generateQueryConditions,
  generateQuerySorts,
  customPaginate,
} from 'src/shared/helpers';

import { PaginationMetadata } from 'src/shared/pagination-metadata';

@Injectable()
export class DomainService {
  constructor(
    @InjectRepository(Domain)
    private readonly domainRepository: Repository<Domain>,
  ) {}

  public create(createDomainDto: CreateDomainDto) {
    const domain = this.domainRepository.create(createDomainDto);

    return this.domainRepository.save(domain);
  }

  public findAll(filter: FindAllDomainDto) {
    const query = this.domainRepository
      .createQueryBuilder('domain')
      .leftJoin('domain.user', 'user')
      .addSelect(['user.id', 'user.name', 'user.email'])
      .where('true');

    generateQuerySorts<Domain>(query, filter, Domain, 'domain');

    generateQueryConditions<Domain>(query, filter, 'domain');

    return customPaginate<Domain, PaginationMetadata>(query, {
      limit: filter.pagination.limit,
      page: filter.pagination.page,
    });
  }

  public findOne(
    domainOptions: FindOptionsWhere<Domain>,
    options?: {
      selected?: FindOptionsSelect<Domain>;
      relations?: FindOptionsRelations<Domain>;
    },
  ) {
    return this.domainRepository.findOne({
      select: options?.selected,
      relations: options?.relations,
      where: domainOptions,
    });
  }

  public async update(id: number, updateDomainDto: UpdateDomainDto) {
    await this.domainRepository.update(id, updateDomainDto);

    return this.findOne({ id });
  }

  public remove(id: number) {
    this.domainRepository.delete(id);
  }
}
