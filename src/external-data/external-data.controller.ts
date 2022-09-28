import {
  Body,
  Controller,
  ParseFilePipeBuilder,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { ExternalDataService } from './external-data.service';
import { CreateExternalDataDto } from './dto/create-external-data.dto';
import { ApiConsumes } from '@nestjs/swagger';

@Controller()
export class ExternalDataController {
  constructor(private readonly externalDataService: ExternalDataService) {}

  @UseInterceptors(FileInterceptor('file'))
  @Post('file')
  @ApiConsumes('multipart/form-data')
  async uploadFile(
    @Body() body: CreateExternalDataDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      console.log({ file, body });
      const rows = this.externalDataService.getRows(file.buffer);

      const filteredRows = this.externalDataService.filterRows(rows);

      const mounth = this.externalDataService.getMonthName(rows);

      return { mounth, inputs: filteredRows };
    } catch (err) {
      console.log('err ==> ', err);
      return '----------------------- deu ruim -----------------------';
    }
  }

  @UseInterceptors(FileInterceptor('file'))
  @Post('file/fail-validation')
  uploadFileAndFailValidation(
    @Body() body: CreateExternalDataDto,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: 'jpg',
        })
        .build(),
    )
    file: Express.Multer.File,
  ) {
    return {
      body,
      file: file.buffer.toString(),
    };
  }
}
