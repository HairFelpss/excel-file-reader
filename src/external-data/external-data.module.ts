import { Module } from '@nestjs/common';
import { ExternalDataService } from './external-data.service';
import { ExternalDataController } from './external-data.controller';

@Module({
  controllers: [ExternalDataController],
  providers: [ExternalDataService],
})
export class ExternalDataModule {}
