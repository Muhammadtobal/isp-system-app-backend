import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  FindOptionsRelations,
  FindOptionsSelect,
  FindOptionsWhere,
  Repository,
} from 'typeorm';

import { CreateNetworkDto } from './dto/create-network.dto';
import { UpdateNetworkDto } from './dto/update-network.dto';
import { Network } from './entities/network.entity';
import { FindAllNetworkDto } from './dto/find-all-network.dto';

import {
  generateQueryConditions,
  generateQuerySorts,
  customPaginate,
} from 'src/shared/helpers';
import { PaginationMetadata } from 'src/shared/pagination-metadata';

@Injectable()
export class NetworkService {
  constructor(
    @InjectRepository(Network)
    private readonly networkRepository: Repository<Network>,
  ) {}

  public create(createNetworkDto: CreateNetworkDto) {
    const network = this.networkRepository.create(createNetworkDto);
    return this.networkRepository.save(network);
  }

  public findAll(filter: FindAllNetworkDto) {
    const query = this.networkRepository
      .createQueryBuilder('network')
      .where('true');

    generateQuerySorts<Network>(query, filter, Network, 'network');

    generateQueryConditions<Network>(query, filter, 'network');

    return customPaginate<Network, PaginationMetadata>(query, {
      limit: filter.pagination.limit,
      page: filter.pagination.page,
    });
  }

  public findOne(
    networkOptions: FindOptionsWhere<Network>,
    options?: {
      selected?: FindOptionsSelect<Network>;
      relations?: FindOptionsRelations<Network>;
    },
  ) {
    return this.networkRepository.findOne({
      select: options?.selected,
      relations: options?.relations,
      where: networkOptions,
    });
  }

  public async update(id: number, updateNetworkDto: UpdateNetworkDto) {
    await this.networkRepository.update(id, updateNetworkDto);
    return this.findOne({ id });
  }

  public remove(id: number) {
    this.networkRepository.delete(id);
  }
}
