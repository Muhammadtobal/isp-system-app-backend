import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  FindOptionsRelations,
  FindOptionsSelect,
  FindOptionsWhere,
  Repository,
} from 'typeorm';

import { CreateTemplateDto } from './dto/create-template.dto';
import { UpdateTemplateDto } from './dto/update-template.dto';
import { FindAllTemplateDto } from './dto/find-all-template.dto';
import { Template } from './entities/template.entity';

import {
  generateQueryConditions,
  generateQuerySorts,
  customPaginate,
} from 'src/shared/helpers';
import { PaginationMetadata } from 'src/shared/pagination-metadata';

@Injectable()
export class TemplateService {
  constructor(
    @InjectRepository(Template)
    private readonly templateRepository: Repository<Template>,
  ) {}

  public async create(createTemplateDto: CreateTemplateDto) {
    const template = this.templateRepository.create(createTemplateDto);

    return this.templateRepository.save(template);
  }

  public async findAll(filter: FindAllTemplateDto) {
    const query = this.templateRepository
      .createQueryBuilder('template')
      .leftJoinAndSelect('template.network', 'network')
      .where('true');

    generateQuerySorts<Template>(query, filter, Template, 'template');

    generateQueryConditions<Template>(query, filter, 'template');

    const result = await customPaginate<Template, PaginationMetadata>(query, {
      limit: filter.pagination.limit,
      page: filter.pagination.page,
    });

    return result;
  }

  public findOne(
    templateOptions: FindOptionsWhere<Template>,
    options?: {
      selected?: FindOptionsSelect<Template>;
      relations?: FindOptionsRelations<Template>;
    },
  ) {
    return this.templateRepository.findOne({
      select: options?.selected,
      relations: options?.relations,
      where: templateOptions,
    });
  }

  public async update(id: number, updateTemplateDto: UpdateTemplateDto) {
    await this.templateRepository.update(id, updateTemplateDto);

    return this.findOne({ id });
  }

  public async remove(id: number) {
    const template = await this.findOne({ id });

    if (!template) {
      throw new NotFoundException('Template not found');
    }

    await this.templateRepository.delete(id);

    return {
      done: true,
    };
  }
}
