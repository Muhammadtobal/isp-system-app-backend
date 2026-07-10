import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DataSource,
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
import { Product } from 'src/product/entities/product.entity';

@Injectable()
export class SoldService {
  constructor(
    @InjectRepository(Sold)
    private readonly soldRepository: Repository<Sold>,
    private readonly productService: ProductService,
    private readonly dataSource: DataSource,
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
    return await this.dataSource.transaction(async (manager) => {
      await manager.delete(Sold, id);

      if (updateSoldDto.product_id && updateSoldDto.amount) {
        const product = await manager.findOne(Product, {
          where: {
            id: updateSoldDto.product_id,
          },
        });

        if (!product) {
          throw new HttpException('لايوجد منتج', HttpStatus.BAD_REQUEST);
        }

        const sold = manager.create(Sold, {
          amount: updateSoldDto.amount,
          product_id: updateSoldDto.product_id,
          unit: updateSoldDto.unit,
          active: updateSoldDto.active,
          user_id: updateSoldDto.user_id,
        });

        sold.value = Number(updateSoldDto.amount) * Number(product.price);

        return await manager.save(Sold, sold);
      }

      return null;
    });
  }

  public remove(id: number) {
    this.soldRepository.delete(id);
  }
}
