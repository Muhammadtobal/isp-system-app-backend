import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  FindOptionsRelations,
  FindOptionsSelect,
  FindOptionsWhere,
  Repository,
} from 'typeorm';

import { ProductType } from './entities/product_type.entity';

import { CreateProductTypeDto } from './dto/create-product_type.dto';
import { UpdateProductTypeDto } from './dto/update-product_type.dto';
import { FindAllProductTypeDto } from './dto/find-all-product_type.dto';

import {
  generateQueryConditions,
  generateQuerySorts,
  customPaginate,
} from 'src/shared/helpers';

import { PaginationMetadata } from 'src/shared/pagination-metadata';

@Injectable()
export class ProductTypeService {
  constructor(
    @InjectRepository(ProductType)
    private readonly productTypeRepository: Repository<ProductType>,
  ) {}

  public create(createProductTypeDto: CreateProductTypeDto) {
    const productType = this.productTypeRepository.create(createProductTypeDto);

    return this.productTypeRepository.save(productType);
  }

  public findAll(filter: FindAllProductTypeDto) {
    const query = this.productTypeRepository
      .createQueryBuilder('productType')
      .where('true');

    generateQuerySorts<ProductType>(query, filter, ProductType, 'productType');

    generateQueryConditions<ProductType>(query, filter, 'productType');

    return customPaginate<ProductType, PaginationMetadata>(query, {
      limit: filter.pagination.limit,
      page: filter.pagination.page,
    });
  }

  public findOne(
    productTypeOptions: FindOptionsWhere<ProductType>,
    options?: {
      selected?: FindOptionsSelect<ProductType>;
      relations?: FindOptionsRelations<ProductType>;
    },
  ) {
    return this.productTypeRepository.findOne({
      select: options?.selected,
      relations: options?.relations,
      where: productTypeOptions,
    });
  }

  public async update(id: number, updateProductTypeDto: UpdateProductTypeDto) {
    await this.productTypeRepository.update(id, updateProductTypeDto);
    return this.findOne({ id });
  }

  public remove(id: number) {
    this.productTypeRepository.delete(id);
  }
}
