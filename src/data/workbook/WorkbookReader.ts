import ExcelJS from "exceljs";

export class WorkbookReader {
  public async read(file: File): Promise<ExcelJS.Workbook> {
    const workbook = new ExcelJS.Workbook();

    const buffer = await file.arrayBuffer();

    await workbook.xlsx.load(buffer);

    return workbook;
  }
}