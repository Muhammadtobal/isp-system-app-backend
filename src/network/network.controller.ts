import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { NetworkService } from './network.service';
import { CreateNetworkDto } from './dto/create-network.dto';
import { UpdateNetworkDto } from './dto/update-network.dto';
import { FindAllNetworkDto } from './dto/find-all-network.dto';

@Controller('network')
export class NetworkController {
  constructor(private readonly networkService: NetworkService) {}

  @Post('create')
  create(@Body() createNetworkDto: CreateNetworkDto) {
    return this.networkService.create(createNetworkDto);
  }

  @Post('get-all')
  findAll(@Body() filter: FindAllNetworkDto) {
    return this.networkService.findAll(filter);
  }

  @Get('get-one/:id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.networkService.findOne({ id });
  }

  @Patch('update/:id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateNetworkDto: UpdateNetworkDto,
  ) {
    return this.networkService.update(id, updateNetworkDto);
  }

  @Delete('remove/:id')
  remove(@Param('id', ParseIntPipe) id: number) {
    this.networkService.remove(id);
    return {
      done: true,
    };
  }
}
