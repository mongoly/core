import { isDeepStrictEqual } from "node:util";
import type { Db } from "mongodb";
import type { JSONSchemaObject } from "./jsonSchemaExt";

export const ensureJSONSchema = async (
  db: Db,
  collectionName: string,
  jsonSchema: JSONSchemaObject,
) => {
  const collections = await db
    .listCollections({ name: collectionName })
    .toArray();
  if (collections.length === 0) {
    await db.createCollection(collectionName, {
      validator: { $jsonSchema: jsonSchema },
    });
  } else {
    const collection = db.collection(collectionName);
    const options = await collection.options();
    const validator = options.validator || {};
    if (
      !validator.$jsonSchema ||
      !isDeepStrictEqual(options.validator.$jsonSchema, jsonSchema)
    ) {
      await db.command({
        collMod: collectionName,
        validator: {
          ...options.validator,
          $jsonSchema: jsonSchema,
        },
      });
    }
  }
};
