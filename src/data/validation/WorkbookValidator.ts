import type { SchemaDefinition } from "../schema/types";
import ExcelJS from "exceljs";

export class WorkbookValidator {
  public validate(
    workbook: ExcelJS.Workbook,
    schemas: SchemaDefinition[]
  ): void {
    for (const schema of schemas) {
      const targetSheet = schema.sheet.replace("SCHEMA_", "");
      const worksheet = workbook.getWorksheet(targetSheet);

      if (!worksheet) {
        throw new Error(`Worksheet '${targetSheet}' tidak ditemukan.`);
      }

      const headers = this.getHeaders(worksheet, targetSheet);

      this.validateDuplicateHeaders(headers, targetSheet);
      this.validateSchemaFields(headers, schema, targetSheet);
    }
  }

  private getHeaders(
    worksheet: ExcelJS.Worksheet,
    targetSheet: string
  ): string[] {
    const headerRow = worksheet.getRow(1);
    const headers: string[] = [];

    headerRow.eachCell({ includeEmpty: true }, (cell) => {
      headers.push(String(cell.value ?? "").trim());
    });

    if (headers.length === 0 || headers.every((header) => header === "")) {
      throw new Error(`Header pada sheet '${targetSheet}' kosong atau tidak valid.`);
    }

    return headers;
  }

  private validateDuplicateHeaders(
    headers: string[],
    targetSheet: string
  ): void {
    const seen = new Set<string>();
    const duplicates = new Set<string>();

    for (const header of headers) {
      if (!header) {
        continue;
      }

      if (seen.has(header)) {
        duplicates.add(header);
      }

      seen.add(header);
    }

    if (duplicates.size > 0) {
      throw new Error(
        `Duplicate header ditemukan pada sheet '${targetSheet}': ${[
          ...duplicates,
        ].join(", ")}.`
      );
    }
  }

  private validateSchemaFields(
    headers: string[],
    schema: SchemaDefinition,
    targetSheet: string
  ): void {
    for (const field of schema.fields) {
      if (!headers.includes(field.header)) {
        throw new Error(
          `Kolom '${field.header}' tidak ditemukan pada sheet '${targetSheet}'.`
        );
      }
    }
  }
}