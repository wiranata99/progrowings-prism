import { WorkbookReader } from "../workbook/WorkbookReader";
import { SchemaLoader } from "../schema/SchemaLoader";
import { WorkbookValidator } from "../validation/WorkbookValidator";
import type { PrismSnapshot } from "../../types/prism";

export class PrismEngine {
  private readonly workbookReader = new WorkbookReader();
  private readonly schemaLoader = new SchemaLoader();
  private readonly workbookValidator = new WorkbookValidator();

  public async load(file: File): Promise<PrismSnapshot> {
    const workbook = await this.workbookReader.read(file);

    const schemas = await this.schemaLoader.load(workbook);

    this.workbookValidator.validate(workbook, schemas);

    throw new Error("SnapshotBuilder belum diimplementasikan.");
  }
}