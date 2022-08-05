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

export type EnumKeywords = {
  enum: unknown[];
};

export type NumberKeywords = {
  bsonType: "double" | "int" | "long" | "decimal" | "number";
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

export type CommonKeywords = {
  description?: string;
};

export type AnyKeywords = {
  bsonType?: BsonType | BsonType[];
};

export type JSONSchemaNumber = CommonKeywords & NumberKeywords;
export type JSONSchemaString = CommonKeywords & StringKeywords;
export type JSONSchemaObject = CommonKeywords & ObjectKeywords;
export type JSONSchemaArray = CommonKeywords & ArrayKeywords;
export type JSONSchemaEnum = CommonKeywords & EnumKeywords;
export type JSONSchemaAny = CommonKeywords & AnyKeywords;

export type JSONSchema =
  | JSONSchemaNumber
  | JSONSchemaString
  | JSONSchemaObject
  | JSONSchemaArray
  | JSONSchemaEnum
  | JSONSchemaAny;

export type JSONSchemaComposition = {
  allOf?: JSONSchema[];
  anyOf?: JSONSchema[];
  oneOf?: JSONSchema[];
  not?: JSONSchema;
};
