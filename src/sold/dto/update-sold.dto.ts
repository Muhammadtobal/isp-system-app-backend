import { PartialType } from '@nestjs/swagger';
import { CreateSoldDto } from './create-sold.dto';

export class UpdateSoldDto extends PartialType(CreateSoldDto) {}
