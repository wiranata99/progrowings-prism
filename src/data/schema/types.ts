export type SemanticType =
  | "metric"
  | "threshold"
  | "status"
  | "narrative"
  | "calculation"
  | "metadata";

export interface SchemaField {
  header: string;
  displayName: string;
  description: string;

  module: string;
  component: string;

  semanticType: SemanticType;

  dataType: string;

  required: boolean;
}

export interface SchemaDefinition {
  sheet: string;
  fields: SchemaField[];
}