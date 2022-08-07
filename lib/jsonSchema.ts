/*
Resources:
 https://www.mongodb.com/docs/manual/reference/operator/query/jsonSchema/#json-schema
 https://github.com/mongodb-js/ace-autocompleter/tree/main/lib/constants
 www.mongodb.com/docs/manual/reference/operator/query/type/#std-label-document-type-available-types
 https://github.com/mongodb/mongo/blob/master/src/mongo/db/matcher/schema/json_schema_parser.cpp

TODO: https://www.mongodb.com/docs/manual/core/csfle/fundamentals/create-schema/#encrypt-keyword
 */

export type JSONType =
  | "array"
  | "boolean"
  | "null"
  | "number"
  | "object"
  | "string";

export type GenericBSONType = "array" | "bool" | "null" | "object" | "string";

export type NumericBSONType = "number" | "int" | "decimal" | "double" | "long";

export type UniqueBSONType =
  | "objectId"
  | "timestamp"
  | "date"
  | "binData"
  | "regex"
  | "minKey"
  | "maxKey"
  | "javascript";

export type BSONType = GenericBSONType | NumericBSONType | UniqueBSONType;

export type NumericKeywords = {
  minimum?: number;
  exclusiveMinimum?: number;
  maximum?: number;
  exlcusiveMaximum?: number;
  multipleOf?: number;
};

export type StringKeywords = {
  minLength?: number;
  maxLength?: number;
  pattern?: string;
};

export type ScalarKeywords = NumericKeywords & StringKeywords;

export type LogicalKeywords = {
  allOf?: JSONSchema[];
  anyOf?: JSONSchema[];
  oneOf?: JSONSchema[];
  not?: JSONSchema;
  enum?: unknown[];
};

export type ArrayKeywords = {
  minItems?: number;
  maxItems?: number;
  uniqueItems?: boolean;
  items?: JSONSchema | JSONSchema[];
  additionalItems?: boolean | JSONSchema;
};

export type ObjectKeywords = {
  dependencies?: Record<string, string[]>;
  additionalProperties?: boolean | JSONSchema;
  maxProperties?: number;
  minProperties?: number;
  patternProperties?: Record<string, JSONSchema>;
  properties?: Record<string, JSONSchema>;
  required?: string[];
};

export type MetadataKeywords = {
  title?: string;
  description?: string;
};

export type JSONSchema = LogicalKeywords &
  ArrayKeywords &
  ObjectKeywords &
  ScalarKeywords &
  MetadataKeywords;
