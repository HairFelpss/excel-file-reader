import { Injectable } from '@nestjs/common';
import { CreateExternalDataDto } from './dto/create-external-data.dto';
import { UpdateExternalDataDto } from './dto/update-external-data.dto';

@Injectable()
export class ExternalDataService {
  create(createExternalDataDto: CreateExternalDataDto) {
    return 'This action adds a new externalDatum';
  }

  findAll() {
    return `This action returns all externalData`;
  }

  findOne(id: number) {
    return `This action returns a #${id} externalDatum`;
  }

  update(id: number, updateExternalDataDto: UpdateExternalDataDto) {
    return `This action updates a #${id} externalDatum`;
  }

  remove(id: number) {
    return `This action removes a #${id} externalDatum`;
  }
}
