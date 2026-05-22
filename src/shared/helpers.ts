import { IPaginationMeta, ObjectLiteral } from 'nestjs-typeorm-paginate';
import { PaginationMetadata } from './pagination-metadata';
import { getMetadataArgsStorage, SelectQueryBuilder } from 'typeorm';

import {
  ListOfIdsInput,
  MatchInput,
  MaxDateInput,
  MaxNumberInput,
  MinDateInput,
  MinNumberInput,
  SingleDateInput,
  SingleIdInput,
  SingleNumberInput,
} from 'src/shared/dto';
import {
  InInputSchema,
  ListOfIdsInputSchema,
  MatchInputSchema,
  MaxDateInputSchema,
  MaxNumberInputSchema,
  MinDateInputSchema,
  MinNumberInputSchema,
  RangeDateInputSchema,
  RangeNumberInputSchema,
  SingleDateInputSchema,
  SingleIdInputSchema,
  SingleNumberInputSchema,
} from 'src/shared/zod-schemas';
import { diskStorage, memoryStorage } from 'multer';

import { Request } from 'express';
import { extname } from 'path';
import { HttpException, HttpStatus } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

export interface RequestWithUser extends Request {
  user: {
    userId: number;
  };
}

export function generateQuerySorts<T>(
  // @ts-ignore
  query: SelectQueryBuilder<T>,
  filter: any,
  entity: Function,
  entityName: string,
) {
  if (
    filter.sort &&
    isValidColumn(entity, filter.sort.by.split('.')[0]) &&
    ['ASC', 'DESC'].includes(filter.sort.type)
  ) {
    if (
      filter.sort.by.split('.')[0] === 'counts' &&
      filter.sort.by.split('.')[1]
    )
      query.orderBy(
        `JSON_EXTRACT(${entityName}.counts, '$.${filter.sort.by.split('.')[1]}')`,
        `${filter.sort.type}` as 'ASC' | 'DESC',
      );
    else
      query.orderBy(
        `${entityName}.${filter.sort.by}`,
        `${filter.sort.type}` as 'ASC' | 'DESC',
      );
  } else query.orderBy(`${entityName}.id`, `DESC`);
}
export function isValidColumn(entity: Function, columnName: string): boolean {
  const columns = getMetadataArgsStorage()
    .columns.filter((col) => col.target === entity)
    .map((col) => col.propertyName);

  return columns.includes(columnName as string);
}

export function generateQueryConditions<T>(
  // @ts-ignore
  query: SelectQueryBuilder<T>,
  filter: any,
  entityName: string,
) {
  // TODO: SingleIdInputSchema is missed !
  for (const key in filter) {
    if (typeof filter[key] === 'boolean')
      query.andWhere(`${entityName}.${key} = :${key}`, {
        [key]: filter[key],
      });
    if (
      SingleDateInputSchema.safeParse(filter[key]).success &&
      hasOnlySpecificProperties(filter[key], ['value'])
    ) {
      const value = (filter[key] as SingleDateInput).value;
      const isYear = /^\d{4}$/.test(value);

      if (isYear) {
        query.andWhere(`YEAR(${entityName}.${key}) = :${key}`, {
          [key]: Number(value),
        });

        continue;
      }

      const date = new Date((filter[key] as SingleDateInput).value);

      const start = new Date(date);
      start.setHours(0, 0, 0, 0);

      const end = new Date(date);
      end.setHours(23, 59, 59, 999);

      query.andWhere(`${entityName}.${key} BETWEEN :start AND :end`, {
        start,
        end,
      });
    }
    if (
      MinDateInputSchema.safeParse(filter[key]).success &&
      hasOnlySpecificProperties(filter[key], ['min'])
    )
      query.andWhere(`${entityName}.${key} >= :${key}`, {
        [key]: (filter[key] as MinDateInput).min,
      });

    if (
      MaxDateInputSchema.safeParse(filter[key]).success &&
      hasOnlySpecificProperties(filter[key], ['max'])
    )
      query.andWhere(`${entityName}.${key} < :${key}`, {
        [key]: (filter[key] as MaxDateInput).max,
      });

    if (RangeDateInputSchema.safeParse(filter[key]).success)
      query.andWhere(`${entityName}.${key} BETWEEN :min AND :max`, {
        ...filter[key],
      });

    if (
      SingleNumberInputSchema.safeParse(filter[key]).success &&
      hasOnlySpecificProperties(filter[key], ['value'])
    )
      query.andWhere(`${entityName}.${key} = :${key}`, {
        [key]: (filter[key] as SingleNumberInput).value,
      });

    if (
      MinNumberInputSchema.safeParse(filter[key]).success &&
      hasOnlySpecificProperties(filter[key], ['min'])
    )
      query.andWhere(`${entityName}.${key} >= :${key}`, {
        [key]: (filter[key] as MinNumberInput).min,
      });

    if (
      MaxNumberInputSchema.safeParse(filter[key]).success &&
      hasOnlySpecificProperties(filter[key], ['max'])
    )
      query.andWhere(`${entityName}.${key} < :${key}`, {
        [key]: (filter[key] as MaxNumberInput).max,
      });

    if (RangeNumberInputSchema.safeParse(filter[key]).success)
      query.andWhere(`${entityName}.${key} BETWEEN :min AND :max`, {
        ...filter[key],
      });

    if (
      ListOfIdsInputSchema.safeParse(filter[key]).success &&
      hasOnlySpecificProperties(filter[key], ['ids'])
    )
      query.andWhere(`${entityName}.${key} IN (:...${key}s)`, {
        [key + 's']: (filter[key] as ListOfIdsInput).ids,
      });

    if (MatchInputSchema.safeParse(filter[key]).success) {
      if ((filter[key] as MatchInput).op === 'full')
        query.andWhere(`${entityName}.${key} = :${key}`, {
          [key]: (filter[key] as MatchInput).value,
        });
      else
        query.andWhere(`${entityName}.${key} LIKE :${key}`, {
          [key]: `%${(filter[key] as MatchInput).value}%`,
        });
    }

    if (
      InInputSchema.safeParse(filter[key]).success &&
      hasOnlySpecificProperties(filter[key], ['in'])
    )
      query.andWhere(`${entityName}.${key} IN(:...in_values)`, {
        in_values: filter[key]['in'],
      });

    if (
      SingleIdInputSchema.safeParse(filter[key]).success &&
      hasOnlySpecificProperties(filter[key], ['value'])
    ) {
      query.andWhere(`${entityName}.${key} = :${key}`, {
        [key]: (filter[key] as SingleIdInput).value,
      });
    }

    if (key === 'counts') {
      for (const countsKey in filter.counts) {
        const countsValue = filter.counts[countsKey];

        // Single value
        if (
          SingleNumberInputSchema.safeParse(countsValue).success &&
          hasOnlySpecificProperties(countsValue, ['value'])
        ) {
          query.andWhere(
            `JSON_EXTRACT(${entityName}.counts, '$.${countsKey}') = :value`,
            { value: countsValue.value },
          );
        }

        // Minimum value
        if (
          MinNumberInputSchema.safeParse(countsValue).success &&
          hasOnlySpecificProperties(countsValue, ['min'])
        ) {
          query.andWhere(
            `JSON_EXTRACT(${entityName}.counts, '$.${countsKey}') >= :min`,
            { min: countsValue.min },
          );
        }

        // Maximum value
        if (
          MaxNumberInputSchema.safeParse(countsValue).success &&
          hasOnlySpecificProperties(countsValue, ['max'])
        ) {
          query.andWhere(
            `JSON_EXTRACT(${entityName}.counts, '$.${countsKey}') <= :max`,
            { max: countsValue.max },
          );
        }

        // Range (min + max)
        if (RangeNumberInputSchema.safeParse(countsValue).success) {
          query.andWhere(
            `JSON_EXTRACT(${entityName}.counts, '$.${countsKey}') BETWEEN :min AND :max`,
            { min: countsValue.min, max: countsValue.max },
          );
        }
      }
    }
  }
}

function buildDayRange(date: string) {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);

  const end = new Date(date);
  end.setHours(0, 0, 0, 0);
  end.setDate(end.getDate() + 1);

  return { start, end };
}

export function hasOnlySpecificProperties(obj, allowedKeys: string[]) {
  const objKeys = Object.keys(obj);

  return (
    objKeys.length === allowedKeys.length &&
    objKeys.every((key) => allowedKeys.includes(key))
  );
}
export const metaTransformer = (meta: IPaginationMeta): PaginationMetadata =>
  new PaginationMetadata(
    meta?.totalItems || 0,
    meta.currentPage,
    meta.itemsPerPage,
    meta?.totalPages || 0,
  );

export async function customPaginate<
  T extends ObjectLiteral,
  M = PaginationMetadata,
>(
  query: SelectQueryBuilder<T>,
  options: {
    limit: number;
    page: number;
  },
): Promise<{ items: T[]; meta: PaginationMetadata }> {
  const { limit, page } = options;
  const offset = (page - 1) * limit;

  let data: T[] = await query.clone().take(limit).skip(offset).getMany();

  const mainAlias = query.expressionMap.mainAlias?.name;
  if (!mainAlias) throw new Error('Main alias not found in query builder');

  const countQuery = query.clone();
  countQuery.expressionMap.skip = undefined;
  countQuery.expressionMap.take = undefined;
  countQuery.expressionMap.orderBys = {};
  const rawCount = await countQuery
    .select(`COUNT(DISTINCT ${mainAlias}.id)`, 'cnt')
    .getRawOne<{ cnt: string }>();
  const totalItems = Number(rawCount?.cnt ?? 0);

  const metaData: IPaginationMeta = {
    itemCount: data.length,
    totalItems,
    itemsPerPage: limit,
    currentPage: page,
    totalPages: Math.ceil(totalItems / limit),
  };

  return {
    items: data,
    meta: metaTransformer(metaData),
  };
}

// export function getUser(user: { role: string; userId: number }) {
//   if (!user?.userId || !user?.role) {
//     return null;
//   }

//   return user;
// }

// export function getEmp(user: { empId: number; userId: number }) {
//   return user || null;
// }

export interface AuthUser {
  userId: number;
  role: string;
  empId?: number;
  permissions?: string[];
}

// export const multerImageOptions = () => ({
//   storage: memoryStorage(),

//   limits: {
//     fileSize: Number(process.env.MAX_SIZE_IMAGE),
//   },

//   fileFilter: (req: any, file, cb) => {
//     const allowed = ['jpg', 'jpeg', 'png'];

//     const ext = extname(file.originalname).slice(1).toLowerCase();

//     if (!allowed.includes(ext)) {
//       return cb(
//         new HttpException('المسار غير صحيح', HttpStatus.BAD_REQUEST),
//         false,
//       );
//     }

//     cb(null, true);
//   },
// });

export const MulterImageConfigInterceptor = FileInterceptor('logo', {
  storage: memoryStorage(),

  limits: {
    fileSize: Number(process.env.MAX_SIZE_IMAGE ?? 12582912),
  },

  fileFilter: (req, file, cb) => {
    const allowed = ['jpg', 'jpeg', 'png'];

    const ext = extname(file.originalname).slice(1).toLowerCase();

    if (!allowed.includes(ext)) {
      return cb(
        new HttpException('صيغة الصورة غير مدعومة', HttpStatus.BAD_REQUEST),
        false,
      );
    }

    cb(null, true);
  },
});

export function buildFileUrl(filePath?: string) {
  if (!filePath) return null;

  const host = process.env.HOST?.replace(/\/$/, '') || 'http://localhost:3000';

  const base = process.env.BASE_URL || '';

  return `${host}${base}/${filePath}`;
}
