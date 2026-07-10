import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';

import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FindAllProductDto } from './dto/find-all-product.dto';

import { JwtAuthUserGuard } from 'src/auth/guards/jwt-auth-user.guard';
import { JwtAuthSharedGuard } from 'src/auth/guards/jwt-auth-shared.guard';

import { Permissions } from 'src/shared/decorators/permissions.decorator';
import { Operation } from 'src/shared/enums/operation..enum';
import { CurrentUser } from 'src/shared/decorators/req.guard.decorate';

import { AuthUser } from 'src/shared/helpers';
import { Product } from './entities/product.entity';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post('create')
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.CREATE + Product.name)
  create(
    @Body() createProductDto: CreateProductDto,
    @CurrentUser() req: AuthUser,
  ) {
    const user = req;

    if (user.role !== 'admin') {
      createProductDto.user_id = user.userId;
    }

    return this.productService.create(createProductDto);
  }

  @Post('get-all')
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.GET + Product.name)
  findAll(@Body() filter: FindAllProductDto) {
    return this.productService.findAll(filter);
  }

  @Get('get-one/:id')
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.GET + Product.name)
  findOne(@Param('id') id: number) {
    return this.productService.findOne({ id });
  }

  @Patch('update/:id')
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.UPDATE + Product.name)
  update(@Param('id') id: number, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(id, updateProductDto);
  }

  @Delete('remove/:id')
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.DELETE + Product.name)
  remove(@Param('id') id: number) {
    this.productService.remove(id);
    return {
      done: true,
    };
  }

  @Get('products-statistics')
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.GET + Product.name)
  async productsStatistics(@CurrentUser() req: AuthUser) {
    const user = req;

    let user_id;
    if (user.role !== 'admin') {
      user_id = user.userId;
    }

    let totalProducts = 0;
    let activeProducts = 0;
    let inactiveProducts = 0;

    const limit = 200;
    let page = 1;
    let lastPage = false;

    while (!lastPage) {
      const result = await this.productService.findAll({
        pagination: { page, limit },
        user_id: { value: Number(user_id) },
      });

      if (!result.items.length) break;

      for (const p of result.items) {
        totalProducts++;

        if (p.active) activeProducts++;
        else inactiveProducts++;
      }

      if (result.items.length < limit) {
        lastPage = true;
      } else {
        page++;
      }
    }

    return {
      totalProducts,
      activeProducts,
      inactiveProducts,
    };
  }
}
