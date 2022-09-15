import { PartialType } from '@nestjs/swagger';
import { CreateExternalDataDto } from './create-external-data.dto';

export class UpdateExternalDataDto extends PartialType(CreateExternalDataDto) {}
