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
import { Permissions } from 'src/shared/decorators/permissions.decorator';
import { Operation } from 'src/shared/enums/operation..enum';
import { Network } from './entities/network.entity';
import { JwtAuthSharedGuard } from 'src/auth/guards/jwt-auth-shared.guard';

@Controller('network')
export class NetworkController {
  constructor(private readonly networkService: NetworkService) {}

  @Post('create')
  @UseGuards(JwtAuthUserGuard)
  @Permissions(Operation.CREATE + Network.name)
  create(@Body() createNetworkDto: CreateNetworkDto) {
    return this.networkService.create(createNetworkDto);
  }

  @Post('get-all')
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.GET + Network.name)
  findAll(@Body() filter: FindAllNetworkDto) {
    return this.networkService.findAll(filter);
  }

  @Get('get-one/:id')
  @UseGuards(JwtAuthUserGuard)
  @Permissions(Operation.GET + Network.name)
  findOne(@Param('id') id: number) {
    return this.networkService.findOne({ id });
  }

  @Patch('update/:id')
  @UseGuards(JwtAuthUserGuard)
  @Permissions(Operation.UPDATE + Network.name)
  update(@Param('id') id: number, @Body() updateNetworkDto: UpdateNetworkDto) {
    return this.networkService.update(id, updateNetworkDto);
  }

  @Delete('remove/:id')
  @UseGuards(JwtAuthUserGuard)
  @Permissions(Operation.DELETE + Network.name)
  remove(@Param('id') id: number) {
    this.networkService.remove(id);
    return {
      done: true,
    };
  }
}
