import type {
  JSONType,
  NumericBSONType,
  BSONType,
  ArrayKeywords,
  ObjectKeywords,
  NumericKeywords,
  StringKeywords,
} from "./jsonSchema";

type RequireOnlyOne<T> = {
  [K in keyof T]-?: Required<Pick<T, K>> &
    Partial<Record<Exclude<keyof T, K>, undefined>>;
}[keyof T];

type RequireAtLeastType<Types extends JSONType & BSONType> = RequireOnlyOne<{
  type?: Types;
  bsonType?: Types;
}>;

type RequireAtLeastTypes<
  JSONTypes extends JSONType,
  BSONTypes extends BSONType,
> = RequireOnlyOne<{
  type?: JSONTypes;
  bsonType?: BSONTypes;
}>;

// TODO: Union `MetadataKeywords` neatly.

export type JSONSchemaBoolean = RequireAtLeastTypes<"boolean", "bool">;
export type JSONSchemaString = RequireAtLeastType<"string"> & StringKeywords;
export type JSONSchemaObject = RequireAtLeastType<"object"> & ObjectKeywords;
export type JSONSchemaArray = RequireAtLeastType<"array"> & ArrayKeywords;
export type JSONSchemaNumber = RequireAtLeastTypes<"number", NumericBSONType> &
  NumericKeywords;

export type BSONSchemaObjectId = { bsonType: "objectId" };
export type BSONSchemaTimestamp = { bsonType: "timestamp" };
export type BSONSchemaDate = { bsonType: "date" };
export type BSONSchemaBinData = { bsonType: "binData" };
export type BSONSchemaRegex = { bsonType: "regex" };
export type BSONSchemaMinKey = { bsonType: "minKey" };
export type BSONSchemaMaxKey = { bsonType: "maxKey" };
export type BSONSchemaJavascript = { bsonType: "javascript" };
