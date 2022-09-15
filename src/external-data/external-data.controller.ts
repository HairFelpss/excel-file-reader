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

import * as XLSX from 'xlsx';

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
      const wb: XLSX.WorkBook = XLSX.read(file.buffer, { codepage: 23 });

      const revenueCalc = wb.SheetNames.find(
        (sheet) => sheet === 'Cálculo da Receita',
      );
      const ws: XLSX.WorkSheet = wb.Sheets[revenueCalc];

      const jsonData = XLSX.utils.sheet_to_json(ws);

      const rows = JSON.parse(JSON.stringify(jsonData));

      if (rows.length <= 1) {
        throw 'File is empty!';
      }

      return rows;
    } catch (err) {
      console.log('err ==> ', err);
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
