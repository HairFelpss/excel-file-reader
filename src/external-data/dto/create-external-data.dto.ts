import { ApiProperty } from '@nestjs/swagger';

export class CreateExternalDataDto {
  @ApiProperty({ type: 'string', format: 'binary', required: true })
  file: Express.Multer.File;
}
