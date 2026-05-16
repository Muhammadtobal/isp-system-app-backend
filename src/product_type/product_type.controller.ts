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

import { ProductTypeService } from './product_type.service';
import { CreateProductTypeDto } from './dto/create-product_type.dto';
import { UpdateProductTypeDto } from './dto/update-product_type.dto';
import { FindAllProductTypeDto } from './dto/find-all-product_type.dto';

import { JwtAuthSharedGuard } from 'src/auth/guards/jwt-auth-shared.guard';
import { JwtAuthUserGuard } from 'src/auth/guards/jwt-auth-user.guard';

import { Permissions } from 'src/shared/decorators/permissions.decorator';
import { Operation } from 'src/shared/enums/operation..enum';
import { ProductType } from './entities/product_type.entity';

@Controller('product-type')
export class ProductTypeController {
  constructor(private readonly productTypeService: ProductTypeService) {}

  @Post('create')
  @UseGuards(JwtAuthUserGuard)
  @Permissions(Operation.CREATE + ProductType.name)
  create(@Body() createProductTypeDto: CreateProductTypeDto) {
    return this.productTypeService.create(createProductTypeDto);
  }

  @Post('get-all')
  @UseGuards(JwtAuthUserGuard)
  @Permissions(Operation.GET + ProductType.name)
  findAll(@Body() filter: FindAllProductTypeDto) {
    return this.productTypeService.findAll(filter);
  }

  @Get('get-one/:id')
  @UseGuards(JwtAuthUserGuard)
  @Permissions(Operation.GET + ProductType.name)
  findOne(@Param('id') id: number) {
    return this.productTypeService.findOne({ id });
  }

  @Patch('update/:id')
  @UseGuards(JwtAuthUserGuard)
  @Permissions(Operation.UPDATE + ProductType.name)
  update(
    @Param('id') id: number,
    @Body() updateProductTypeDto: UpdateProductTypeDto,
  ) {
    return this.productTypeService.update(id, updateProductTypeDto);
  }

  @Delete('remove/:id')
  @UseGuards(JwtAuthUserGuard)
  @Permissions(Operation.DELETE + ProductType.name)
  remove(@Param('id') id: number) {
    this.productTypeService.remove(id);
    return { done: true };
  }
}
