export type BsonType =
  | "double"
  | "string"
  | "object"
  | "array"
  | "binData"
  | "objectId"
  | "bool"
  | "boolean"
  | "date"
  | "null"
  | "regex"
  | "javascript"
  | "number"
  | "int"
  | "timestamp"
  | "long"
  | "decimal";

export type NumberKeywords = {
  bsonType?: "double" | "int" | "long" | "decimal";
  multipleOf?: number;
  maximum?: number;
  exlcusiveMaximum?: number;
  minimum?: number;
  exclusiveMinimum?: number;
};

export type StringKeywords = {
  bsonType: "string";
  maxLength?: number;
  minLength?: number;
  pattern?: string;
};

export type ObjectKeywords = {
  bsonType: "object";
  maxProperties?: number;
  minProperties?: number;
  required?: string[];
  additionalProperties?: boolean | JSONSchema;
  properties?: Record<string, JSONSchema>;
  patternProperties?: Record<string, JSONSchema>;
};

export type ArrayKeywords = {
  bsonType: "array";
  additionalItems?: boolean | JSONSchema;
  items?: JSONSchema | JSONSchema[];
  maxItems?: number;
  minItems?: number;
  uniqueItems?: boolean;
};

export type GenericKeywords = {
  bsonType?: BsonType | BsonType[];
  description?: string;
  enum?: unknown[];
  allOf?: JSONSchema[];
  anyOf?: JSONSchema[];
  oneOf?: JSONSchema[];
  not?: JSONSchema;
};

export type JSONSchemaNumber = GenericKeywords & NumberKeywords;
export type JSONSchemaString = GenericKeywords & StringKeywords;
export type JSONSchemaObject = GenericKeywords & ObjectKeywords;
export type JSONSchemaArray = GenericKeywords & ArrayKeywords;

export type JSONSchema =
  | GenericKeywords
  | JSONSchemaNumber
  | JSONSchemaString
  | JSONSchemaObject
  | JSONSchemaArray;
