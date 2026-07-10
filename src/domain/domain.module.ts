import { Module } from '@nestjs/common';
import { DomainService } from './domain.service';
import { DomainController } from './domain.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Domain } from './entities/domain.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Domain])],

  controllers: [DomainController],
  providers: [DomainService],
})
export class DomainModule {}
