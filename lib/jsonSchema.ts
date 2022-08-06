// https://www.mongodb.com/docs/manual/reference/operator/query/jsonSchema/#json-schema
// www.mongodb.com/docs/manual/reference/operator/query/type/#std-label-document-type-available-types
// https://github.com/mongodb-js/ace-autocompleter/tree/main/lib/constants

export type JSONType =
  | "array"
  | "boolean"
  | "null"
  | "number"
  | "object"
  | "string";

type GenericBSONType =
  | "array"
  | "bool"
  | "null"
  | "number"
  | "int"
  | "decimal"
  | "double"
  | "long"
  | "object"
  | "string";

type UniqueBSONType =
  | "objectId"
  | "timestamp"
  | "date"
  | "binData"
  | "regex"
  | "minKey"
  | "maxKey"
  | "javascript";

export type BSONType = GenericBSONType | UniqueBSONType;

type RequireAtLeastOne<T> = {
  [K in keyof T]-?: Required<Pick<T, K>> &
    Partial<Pick<T, Exclude<keyof T, K>>>;
}[keyof T];

type RequireAtLeastType<
  JSONTypes extends JSONType,
  GenericBSONTypes extends GenericBSONType,
> = RequireAtLeastOne<{
  type?: JSONTypes;
  bsonType?: GenericBSONTypes;
}>;

type GenericKeywords = {
  title?: string;
  description?: string;
  enum?: unknown[];
};

type CompositionKeywords = {
  allOf?: JSONSchema[];
  anyOf?: JSONSchema[];
  oneOf?: JSONSchema[];
  not?: JSONSchema;
};

type BooleanKeywords = RequireAtLeastType<"boolean", "bool">;

type NumberKeywords = RequireAtLeastType<
  "number",
  "double" | "int" | "long" | "decimal" | "number"
> & {
  multipleOf?: number;
  maximum?: number;
  exlcusiveMaximum?: number;
  minimum?: number;
  exclusiveMinimum?: number;
};

type StringKeywords = RequireAtLeastType<"string", "string"> & {
  maxLength?: number;
  minLength?: number;
  pattern?: string;
};

type ObjectKeywords = RequireAtLeastType<"object", "object"> & {
  maxProperties?: number;
  minProperties?: number;
  required?: string[];
  additionalProperties?: boolean | JSONSchema;
  properties?: Record<string, JSONSchema>;
  patternProperties?: Record<string, JSONSchema>;
  dependencies?: Record<string, string[]>;
};

type ArrayKeywords = RequireAtLeastType<"array", "array"> & {
  additionalItems?: boolean | JSONSchema;
  items?: JSONSchema | JSONSchema[];
  maxItems?: number;
  minItems?: number;
  uniqueItems?: boolean;
};

type BSONKeywords = { bsonType: UniqueBSONType | UniqueBSONType[] };

type CommonKeywords = GenericKeywords & CompositionKeywords;

export type JSONSchemaBoolean = CommonKeywords & BooleanKeywords;
export type JSONSchemaNumber = CommonKeywords & NumberKeywords;
export type JSONSchemaString = CommonKeywords & StringKeywords;
export type JSONSchemaObject = CommonKeywords & ObjectKeywords;
export type JSONSchemaArray = CommonKeywords & ArrayKeywords;
export type JSONSchemaBSON = CommonKeywords & BSONKeywords;
export type JSONSchemaAny = {};

export type JSONSchema =
  | JSONSchemaAny
  | JSONSchemaBoolean
  | JSONSchemaNumber
  | JSONSchemaString
  | JSONSchemaObject
  | JSONSchemaArray
  | JSONSchemaBSON;
