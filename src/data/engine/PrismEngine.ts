import type ExcelJS from "exceljs";

import type { PrismSnapshot } from "../../types/prism";
import { DatabaseReader } from "../database/DatabaseReader";
import { SchemaLoader } from "../schema/SchemaLoader";
import { WorkbookValidator } from "../validation/WorkbookValidator";
import { WorkbookReader } from "../workbook/WorkbookReader";
import { SnapshotBuilder } from "./SnapshotBuilder";
import { SchemaRegistry } from "../registry/SchemaRegistry";

export class PrismEngine {
  private readonly workbookReader = new WorkbookReader();
  private readonly schemaLoader = new SchemaLoader();
  private readonly workbookValidator = new WorkbookValidator();
  private readonly databaseReader = new DatabaseReader();
  private readonly snapshotBuilder = new SnapshotBuilder();

  public async load(file: File): Promise<PrismSnapshot> {
    const workbook = await this.workbookReader.read(file);
    const schemas = await this.schemaLoader.load(workbook);
    const schemaRegistry = new SchemaRegistry(schemas);

     
    this.workbookValidator.validate(workbook, schemas);

    const ewiSheet = this.getRequiredWorksheet(workbook, "DB_EWI");
    const nimSheet = this.getRequiredWorksheet(workbook, "DB_NIM");
    const loanSheet = this.getRequiredWorksheet(workbook, "DB_LOAN");
    const thresholdSheet = this.getRequiredWorksheet(workbook, "DB_THRESHOLD");
    const isSheet = workbook.getWorksheet("DB_IS");

    const context = {
  registry: schemaRegistry,
  ewi: this.databaseReader.read(ewiSheet),
  nim: this.databaseReader.read(nimSheet),
  loan: this.databaseReader.read(loanSheet),
  threshold: this.databaseReader.read(thresholdSheet),
  is: isSheet ? this.databaseReader.read(isSheet) : [],
};

    return this.snapshotBuilder.build(context);
  }

  private getRequiredWorksheet(
    workbook: ExcelJS.Workbook,
    sheetName: string
  ): ExcelJS.Worksheet {
    const worksheet = workbook.getWorksheet(sheetName);

    if (!worksheet) {
      throw new Error(`Worksheet '${sheetName}' tidak ditemukan.`);
    }

    return worksheet;
  }
}