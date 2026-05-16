import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  FindOptionsRelations,
  FindOptionsSelect,
  FindOptionsWhere,
  Repository,
} from 'typeorm';

import { Product } from './entities/product.entity';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FindAllProductDto } from './dto/find-all-product.dto';

import {
  generateQueryConditions,
  generateQuerySorts,
  customPaginate,
} from 'src/shared/helpers';
import { PaginationMetadata } from 'src/shared/pagination-metadata';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  public create(createProductDto: CreateProductDto) {
    const product = this.productRepository.create(createProductDto);
    return this.productRepository.save(product);
  }

  public findAll(filter: FindAllProductDto) {
    const query = this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.product_type', 'product_type')
      .where('true');

    generateQuerySorts<Product>(query, filter, Product, 'product');

    generateQueryConditions<Product>(query, filter, 'product');

    return customPaginate<Product, PaginationMetadata>(query, {
      limit: filter.pagination.limit,
      page: filter.pagination.page,
    });
  }

  public findOne(
    productOptions: FindOptionsWhere<Product>,
    options?: {
      selected?: FindOptionsSelect<Product>;
      relations?: FindOptionsRelations<Product>;
    },
  ) {
    return this.productRepository.findOne({
      select: options?.selected,
      relations: options?.relations,
      where: productOptions,
    });
  }

  public async update(id: number, updateProductDto: UpdateProductDto) {
    await this.productRepository.update(id, updateProductDto);
    return this.findOne({ id });
  }

  public remove(id: number) {
    this.productRepository.delete(id);
  }
}
