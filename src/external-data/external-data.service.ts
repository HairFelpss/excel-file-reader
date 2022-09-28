import { Injectable } from '@nestjs/common';
import * as XLSX from 'xlsx';

import { CreateExternalDataDto } from './dto/create-external-data.dto';
import { UpdateExternalDataDto } from './dto/update-external-data.dto';

@Injectable()
export class ExternalDataService {
  getRows(buffer: Buffer) {
    const wb: XLSX.WorkBook = XLSX.read(buffer, { codepage: 23 });

    const revenueCalc = wb.SheetNames.find(
      (sheet) => sheet === 'Cálculo da Receita',
    );
    const ws: XLSX.WorkSheet = wb.Sheets[revenueCalc];

    const jsonData = XLSX.utils.sheet_to_json(ws);

    const rows = JSON.parse(JSON.stringify(jsonData));

    const indexOfObject = rows.findIndex((row) => row['__EMPTY_1'] === 'TOTAL');

    const slicedRows = rows.slice(0, indexOfObject);

    if (slicedRows.length <= 1) {
      throw 'File is empty!';
    }

    return slicedRows;
  }

  filterRows(rows: any[]) {
    const filteredRows = rows
      .map((row) => {
        const equipament_description = {
          equipament: '',
          description: '',
        };

        if (row['__EMPTY_1']) {
          equipament_description.equipament = row['__EMPTY_1'];

          if (row['__EMPTY_1'].split('-')[1]) {
            equipament_description.equipament = row['__EMPTY_1'].split('-')[1];
            equipament_description.description = row['__EMPTY_1'].split('-')[0];
          }
        }

        const constants = {
          amount_to_pay: row['__EMPTY_9'],
          steel_production: row['__EMPTY_2'],
          supplementary_credit: row['__EMPTY_11'],
        };

        const total_value = row['__EMPTY_10'];

        if (
          constants.amount_to_pay === constants.supplementary_credit &&
          constants.amount_to_pay !== 0 &&
          constants.supplementary_credit !== 0
        ) {
          return {
            ...constants,
            ...equipament_description,
            contract_value: row['__EMPTY_9'],
            type: 'Crédito Débito',
          };
        }

        if (
          constants.amount_to_pay !== total_value &&
          constants.supplementary_credit !== 0
        ) {
          return {
            ...constants,
            ...equipament_description,
            total_value: total_value || 0,
            total_kg: row['__EMPTY_2'] * row['__EMPTY_6'],
            contract_value: row['__EMPTY_3'],
            type: 'Aço Vazado',
          };
        }

        if (constants.amount_to_pay === total_value) {
          return {
            ...constants,
            ...equipament_description,
            total_value: total_value || 0,
            equipament: row['__EMPTY_1'],
            type: 'Material Aplicado',
          };
        }
      })
      .filter(
        ({
          amount_to_pay,
          steel_production,
          supplementary_credit: credito_completar,
        }) => amount_to_pay || steel_production! || credito_completar,
      );

    return filteredRows.slice(1);
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

  getMonthName(rows) {
    const mounth = rows.find((mounth) => mounth['CÁLCULO DA RECEITA']);

    const date = new Date();
    date.setMonth(mounth['CÁLCULO DA RECEITA'].split('/')[1] - 1);

    return date.toLocaleString('pt-BR', { month: 'long' });
  }
}
