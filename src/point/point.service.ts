import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  FindOptionsRelations,
  FindOptionsSelect,
  FindOptionsWhere,
  Repository,
} from 'typeorm';

import { CreatePointDto } from './dto/create-point.dto';
import { UpdatePointDto } from './dto/update-point.dto';
import { Point } from './entities/point.entity';
import { FindAllPointDto } from './dto/find-all-point-type.dto';

import {
  generateQueryConditions,
  generateQuerySorts,
  customPaginate,
} from 'src/shared/helpers';
import { PaginationMetadata } from 'src/shared/pagination-metadata';

@Injectable()
export class PointService {
  constructor(
    @InjectRepository(Point)
    private readonly pointRepository: Repository<Point>,
  ) {}

  public create(createPointDto: CreatePointDto) {
    const point = this.pointRepository.create(createPointDto);
    return this.pointRepository.save(point);
  }

  public findAll(filter: FindAllPointDto) {
    const query = this.pointRepository
      .createQueryBuilder('point')
      .where('true');

    generateQuerySorts<Point>(query, filter, Point, 'point');
    generateQueryConditions<Point>(query, filter, 'point');

    return customPaginate<Point, PaginationMetadata>(query, {
      limit: filter.pagination.limit,
      page: filter.pagination.page,
    });
  }

  public findOne(
    pointOptions: FindOptionsWhere<Point>,
    options?: {
      selected?: FindOptionsSelect<Point>;
      relations?: FindOptionsRelations<Point>;
    },
  ) {
    return this.pointRepository.findOne({
      select: options?.selected,
      relations: options?.relations,
      where: pointOptions,
    });
  }

  public async update(id: number, updatePointDto: UpdatePointDto) {
    await this.pointRepository.update(id, updatePointDto);
    return this.findOne({ id });
  }

  public remove(id: number) {
    this.pointRepository.delete(id);
  }
}
