import { PartialType } from '@nestjs/mapped-types';
import { CreateFooterContentDto } from './create-footer-content.dto';

export class UpdateFooterContentDto extends PartialType(CreateFooterContentDto) {}

