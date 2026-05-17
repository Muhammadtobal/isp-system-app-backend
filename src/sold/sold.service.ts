import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  FindOptionsRelations,
  FindOptionsSelect,
  FindOptionsWhere,
  Repository,
} from 'typeorm';

import { Sold } from './entities/sold.entity';

import { CreateSoldDto } from './dto/create-sold.dto';
import { UpdateSoldDto } from './dto/update-sold.dto';
import { FindAllSoldDto } from './dto/find-all-sold.dto';

import {
  generateQueryConditions,
  generateQuerySorts,
  customPaginate,
} from 'src/shared/helpers';
import { PaginationMetadata } from 'src/shared/pagination-metadata';
import { ProductService } from 'src/product/product.service';

@Injectable()
export class SoldService {
  constructor(
    @InjectRepository(Sold)
    private readonly soldRepository: Repository<Sold>,
    private readonly productService: ProductService,
  ) {}

  public async create(createSoldDto: CreateSoldDto) {
    const sold = this.soldRepository.create(createSoldDto);
    const product = await this.productService.findOne({
      id: createSoldDto.product_id,
    });
    if (!product)
      throw new HttpException('لايوجد منتج', HttpStatus.BAD_REQUEST);
    sold.value = Number(createSoldDto.amount) * Number(product.price);
    return this.soldRepository.save(sold);
  }

  public findAll(filter: FindAllSoldDto) {
    const query = this.soldRepository
      .createQueryBuilder('sold')
      .leftJoinAndSelect('sold.product', 'product')
      .where('true');

    generateQuerySorts<Sold>(query, filter, Sold, 'sold');
    generateQueryConditions<Sold>(query, filter, 'sold');

    return customPaginate<Sold, PaginationMetadata>(query, {
      limit: filter.pagination.limit,
      page: filter.pagination.page,
    });
  }

  public findOne(
    soldOptions: FindOptionsWhere<Sold>,
    options?: {
      selected?: FindOptionsSelect<Sold>;
      relations?: FindOptionsRelations<Sold>;
    },
  ) {
    return this.soldRepository.findOne({
      select: options?.selected,
      relations: options?.relations,
      where: soldOptions,
    });
  }

  public async update(id: number, updateSoldDto: UpdateSoldDto) {
    await this.soldRepository.update(id, updateSoldDto);
    return this.findOne({ id });
  }

  public remove(id: number) {
    this.soldRepository.delete(id);
  }
}
