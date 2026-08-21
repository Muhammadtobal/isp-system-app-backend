import { Module } from '@nestjs/common';
import { TemplateService } from './template.service';
import { TemplateController } from './template.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Template } from './entities/template.entity';
import { NetworkModule } from 'src/network/network.module';

@Module({
  imports: [TypeOrmModule.forFeature([Template]), NetworkModule],
  controllers: [TemplateController],
  providers: [TemplateService],
})
export class TemplateModule {}
