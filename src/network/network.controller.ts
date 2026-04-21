import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { NetworkService } from './network.service';
import { CreateNetworkDto } from './dto/create-network.dto';
import { UpdateNetworkDto } from './dto/update-network.dto';
import { FindAllNetworkDto } from './dto/find-all-network.dto';
import { JwtAuthUserGuard } from 'src/auth/guards/jwt-auth-user.guard';

@Controller('network')
export class NetworkController {
  constructor(private readonly networkService: NetworkService) {}

  @Post('create')
  @UseGuards(JwtAuthUserGuard)
  create(@Body() createNetworkDto: CreateNetworkDto) {
    return this.networkService.create(createNetworkDto);
  }

  @Post('get-all')
  @UseGuards(JwtAuthUserGuard)
  findAll(@Body() filter: FindAllNetworkDto) {
    return this.networkService.findAll(filter);
  }

  @Get('get-one/:id')
  @UseGuards(JwtAuthUserGuard)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.networkService.findOne({ id });
  }

  @Patch('update/:id')
  @UseGuards(JwtAuthUserGuard)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateNetworkDto: UpdateNetworkDto,
  ) {
    return this.networkService.update(id, updateNetworkDto);
  }

  @Delete('remove/:id')
  @UseGuards(JwtAuthUserGuard)
  remove(@Param('id', ParseIntPipe) id: number) {
    this.networkService.remove(id);
    return {
      done: true,
    };
  }
}
