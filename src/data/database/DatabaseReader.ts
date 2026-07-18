import ExcelJS from "exceljs";

export type DatabaseRow = Record<string, unknown>;

export class DatabaseReader {
  public read(worksheet: ExcelJS.Worksheet): DatabaseRow[] {
    const rows: DatabaseRow[] = [];

    const headerRow = worksheet.getRow(1);

    const headers: string[] = [];

    headerRow.eachCell({ includeEmpty: true }, (cell) => {
      headers.push(String(cell.value ?? "").trim());
    });

    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return;

      const record: DatabaseRow = {};

      headers.forEach((header, index) => {
        if (!header) return;

        record[header] = row.getCell(index + 1).value;
      });

      rows.push(record);
    });

    return rows;
  }
}