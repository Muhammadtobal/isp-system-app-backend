import { IsNotEmpty, IsNumberString, IsString } from 'class-validator';
import { CreateConstantInput } from './create-constant.dto';
import { PartialType } from '@nestjs/swagger';

export class UpdateConstantInput extends PartialType(CreateConstantInput) {}
