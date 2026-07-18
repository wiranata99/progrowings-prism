import type {
  SchemaDefinition,
  SchemaField,
  SemanticType,
} from "../schema/types";

export interface SchemaQuery {
  module?: string;
  component?: string;
  semanticType?: SemanticType;
}

export class SchemaRegistry {
  private readonly fields: SchemaField[];

  public constructor(schemas: SchemaDefinition[]) {
    this.fields = schemas.flatMap((schema) => schema.fields);
  }

  public getAll(): SchemaField[] {
    return [...this.fields];
  }

  public findByHeader(header: string): SchemaField | undefined {
    return this.fields.find((field) => field.header === header);
  }

  public find(query: SchemaQuery): SchemaField[] {
    return this.fields.filter((field) => {
      const moduleMatch =
        !query.module ||
        this.normalize(field.module) === this.normalize(query.module);

      const componentMatch =
        !query.component ||
        this.normalize(field.component) === this.normalize(query.component);

      const semanticTypeMatch =
        !query.semanticType || field.semanticType === query.semanticType;

      return moduleMatch && componentMatch && semanticTypeMatch;
    });
  }

  public getMetrics(module?: string, component?: string): SchemaField[] {
    return this.find({
      module,
      component,
      semanticType: "metric",
    });
  }

  public getThresholds(module?: string, component?: string): SchemaField[] {
    return this.find({
      module,
      component,
      semanticType: "threshold",
    });
  }

  public getStatuses(module?: string, component?: string): SchemaField[] {
    return this.find({
      module,
      component,
      semanticType: "status",
    });
  }

  public getNarratives(module?: string, component?: string): SchemaField[] {
    return this.find({
      module,
      component,
      semanticType: "narrative",
    });
  }

  public hasHeader(header: string): boolean {
    return this.findByHeader(header) !== undefined;
  }

  private normalize(value: string): string {
    return value.trim().toLowerCase();
  }
}