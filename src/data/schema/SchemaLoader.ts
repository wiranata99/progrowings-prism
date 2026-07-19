import type { SchemaDefinition, SchemaField } from "./types";
import ExcelJS from "exceljs";

export class SchemaLoader {
  public async load(workbook: ExcelJS.Workbook): Promise<SchemaDefinition[]> {
    const schemas: SchemaDefinition[] = [];

    for (const worksheet of workbook.worksheets) {
      console.log("Worksheet:", JSON.stringify(worksheet.name));

if (!worksheet.name.trim().startsWith("SCHEMA_")) {
  continue;
}

      const headerRow = worksheet.getRow(1);

      const columnIndex = this.buildColumnIndex(headerRow.values as unknown[]);

      console.log("Sheet:", worksheet.name);
        console.log("Header Row:", headerRow.values);
        console.log("Column Index:", columnIndex);

        console.log("Header Index:", columnIndex["Header"]);
        console.log("Row 2:", worksheet.getRow(2).values);

      const fields: SchemaField[] = [];

      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) return;

        const header = this.getCell(row, columnIndex, "Header");

        if (!header) return;

        fields.push({
          header,
          displayName: this.getCell(row, columnIndex, "Display Name"),
          description: this.getCell(row, columnIndex, "Description"),

          module: this.getCell(row, columnIndex, "Module"),
          component: this.getCell(row, columnIndex, "Component"),

          semanticType:
            (this.getCell(row, columnIndex, "Semantic Type")
                .trim()
                .toLowerCase() as SchemaField["semanticType"]) || "metric",

          dataType: this.getCell(row, columnIndex, "Data Type"),

          required:
            this.getCell(row, columnIndex, "Required")
              .toLowerCase()
              .trim() === "yes",
        });
      });

      schemas.push({
        sheet: worksheet.name,
        fields,
      });
    }

    return schemas;
  }

  private buildColumnIndex(values: unknown[]): Record<string, number> {
    const columns: Record<string, number> = {};

    values.forEach((value, index) => {
      if (typeof value === "string") {
        columns[value.trim()] = index;
      }
    });

    return columns;
  }

  private getCell(
    row: ExcelJS.Row,
    columns: Record<string, number>,
    name: string
  ): string {
    const index = columns[name];

    if (!index) return "";

    return String(row.getCell(index).value ?? "").trim();
  }
}