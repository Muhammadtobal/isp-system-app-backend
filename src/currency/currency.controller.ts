import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { CurrencyService } from './currency.service';
import { CreateCurrencyDto } from './dto/create-currency.dto';
import { UpdateCurrencyDto } from './dto/update-currency.dto';
import { JwtAuthSharedGuard } from 'src/auth/guards/jwt-auth-shared.guard';
import { Permissions } from 'src/shared/decorators/permissions.decorator';
import { Operation } from 'src/shared/enums/operation..enum';
import { Currency } from './entities/currency.entity';
import { CreateExchangeRateDto } from './dto/create-exchange_rate.dto';
import { UpdateExchangeRateDto } from './dto/update-exchange_rate.dto';
import { ExchangeRate } from './entities/exchange_rate.entity';
import { FindAllCurrencyDto } from './dto/find-all-currency.dt';
import { FindAllExchangeRateDto } from './dto/find-all-exchange_rate.dto';

@Controller('currency')
export class CurrencyController {
  constructor(private readonly currencyService: CurrencyService) {}

  @Post('create')
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.CREATE + Currency.name)
  public async create(@Body() createCurrencyDto: CreateCurrencyDto) {
    return this.currencyService.create(createCurrencyDto);
  }

  @Post('get-all')
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.GET + Currency.name)
  public findAll(@Body() filter: FindAllCurrencyDto) {
    return this.currencyService.findAll(filter);
  }

  @Get('get-one/:id')
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.GET + Currency.name)
  public findOne(@Param('id') id: number) {
    return this.currencyService.findOne({ id });
  }

  @Patch('update/:id')
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.UPDATE + Currency.name)
  public update(
    @Param('id') id: number,
    @Body() updateCurrencyInput: UpdateCurrencyDto,
  ) {
    return this.currencyService.update(id, updateCurrencyInput);
  }

  @Delete('remove/:id')
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.DELETE + Currency.name)
  public async remove(@Param('id') id: number) {
    await this.currencyService.remove(id);

    return {
      done: true,
    };
  }

  @Post('create-exchange-rate')
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.CREATE + ExchangeRate.name)
  public async createExchangeRate(
    @Body() createExchangeRateDto: CreateExchangeRateDto,
  ) {
    return this.currencyService.createExchangeRate(createExchangeRateDto);
  }

  @Post('get-all-exchange-rate')
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.GET + ExchangeRate.name)
  public findAlExchangeRatel(@Body() filter: FindAllExchangeRateDto) {
    return this.currencyService.findAllExchangeRate(filter);
  }

  @Get('get-one-exchange-rate/:id')
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.GET + ExchangeRate.name)
  public findOneExchangeRate(@Param('id') id: number) {
    return this.currencyService.findOneExchangeRate({ id });
  }

  @Patch('update-exchange-rate/:id')
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.UPDATE + ExchangeRate.name)
  public updateExchangeRate(
    @Param('id') id: number,
    @Body() updateExchangeRateDto: UpdateExchangeRateDto,
  ) {
    return this.currencyService.updateExchangeRate(id, updateExchangeRateDto);
  }

  @Delete('remove-exchange-rate/:id')
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.DELETE + ExchangeRate.name)
  public async removeExchangeRate(@Param('id') id: number) {
    await this.currencyService.removeExchangeRate(id);

    return {
      done: true,
    };
  }
}
