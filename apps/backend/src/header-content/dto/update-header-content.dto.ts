import { PartialType } from '@nestjs/mapped-types';
import { CreateHeaderContentDto } from './create-header-content.dto';

export class UpdateHeaderContentDto extends PartialType(CreateHeaderContentDto) {}

