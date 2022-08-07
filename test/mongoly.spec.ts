import { describe, it, expect, afterEach, beforeAll, afterAll } from "vitest";
import { Db, MongoClient } from "mongodb";
import { JSONSchemaObject, populate } from "../lib";
import {
  ensureJSONSchema,
  ensureIndexes,
  UpdateBuilder,
  findById,
  findByIdAndUpdate,
  findByIdAndDelete,
  updateById,
  deleteById,
  save,
  isDocumentValidationError,
  isClassValidationError,
} from "../lib";

describe("JSON Schema & Indexes", () => {
  let client: MongoClient;
  let db: Db;

  beforeAll(async () => {
    client = await MongoClient.connect("mongodb://localhost:27017/dev_mongoly");
    await client.connect();
    db = client.db();
  });

  afterAll(async () => {
    await db.dropDatabase();
    await client.close();
  });

  it("should be able to create a collection", async () => {
    const jsonSchema: JSONSchemaObject = {
      bsonType: "object",
      properties: {
        name: { bsonType: "string" },
        age: { bsonType: "number" },
      },
    };
    await ensureJSONSchema(db, "users", jsonSchema);
    const collection = db.collection("users");
    const options = await collection.options();
    expect(options.validator).toEqual({ $jsonSchema: jsonSchema });
  });

  it("Should create indexes on a collection", async () => {
    const collection = db.collection("users");
    await ensureIndexes(collection, true, [
      {
        key: { name: 1 },
        unique: true,
      },
    ]);
    const indexes = await collection.listIndexes().toArray();
    expect(indexes.length).toBe(2);
    expect(indexes[1].key).toEqual({ name: 1 });
    expect(indexes[1].unique).toBe(true);
  });

  it("Should insert a valid document", async () => {
    const collection = db.collection("users");
    const doc = { name: "John", age: 30 };
    await collection.insertOne(doc);
  });

  it("Should insert an invalid document", async () => {
    try {
      const collection = db.collection("users");
      const doc = { name: "John", age: "30" };
      await collection.insertOne(doc);
    } catch (e) {
      if (isDocumentValidationError(e) && isClassValidationError(e)) {
        const schemaErrors = e.errInfo!.details.schemaRulesNotSatisfied[0];
        const propertyErrors = schemaErrors.propertiesNotSatisfied;
        expect(propertyErrors[0].propertyName).toBe("age");
        expect(propertyErrors[0].details[0].reason).toBe("type did not match");
        return;
      }
      throw e;
    }
  });
});

describe("Document Utils & UpdateBuilder", () => {
  let client: MongoClient;
  let db: Db;

  beforeAll(async () => {
    client = await MongoClient.connect("mongodb://localhost:27017/dev_mongoly");
    await client.connect();
    db = client.db();
  });

  afterEach(async () => {
    const collections = await db.listCollections().toArray();
    for (const collection of collections) {
      await db.collection(collection.name).deleteMany({});
    }
  });

  afterAll(async () => {
    await db.dropDatabase();
    await client.close();
  });

  it("Should find a document by its ID", async () => {
    const collection = db.collection("users");
    const doc = { name: "John", age: 30 };
    const { insertedId } = await collection.insertOne(doc);
    const found = await findById(collection, insertedId);
    expect(found).toBeDefined();
  });

  it("Should find and update a document by its ID", async () => {
    const collection = db.collection("users");
    const doc = { name: "John", age: 30 };
    const { insertedId } = await collection.insertOne(doc);
    const result = await findByIdAndUpdate(
      collection,
      insertedId,
      {
        $set: { name: "Jane" },
      },
      { returnDocument: "after" },
    );
    expect(result.ok).toBe(1);
    expect(result.value?.name).toBe("Jane");
  });

  it("Should find and delete a document by its ID", async () => {
    const collection = db.collection("users");
    const doc = { name: "John", age: 30 };
    const { insertedId } = await collection.insertOne(doc);
    const result = await findByIdAndDelete(collection, insertedId);
    expect(result.ok).toBe(1);
  });

  it("Should update a document by its ID", async () => {
    const collection = db.collection("users");
    const doc = { name: "John", age: 30 };
    const { insertedId } = await collection.insertOne(doc);
    const { matchedCount, modifiedCount } = await updateById(
      collection,
      insertedId,
      {
        $set: { name: "Jane" },
      },
    );
    expect(matchedCount).toBe(1);
    expect(modifiedCount).toBe(1);
  });

  it("Should delete a document by its ID", async () => {
    const collection = db.collection("users");
    const doc = { name: "John", age: 30 };
    const { insertedId } = await collection.insertOne(doc);
    const { deletedCount } = await deleteById(collection, insertedId);
    expect(deletedCount).toBe(1);
  });

  it("Should save a document", async () => {
    const collection = db.collection("users");
    const doc = { name: "John", age: 30 };
    const { upsertedCount } = await save(collection, doc);
    expect(upsertedCount).toBe(1);
  });

  it("Should get a populated document", async () => {
    const usersCollection = db.collection("users");
    const booksCollection = db.collection("books");
    const petsCollection = db.collection("pets");
    const doc = { name: "John", age: 30 };
    const { insertedId } = await usersCollection.insertOne(doc);
    const book = { title: "Book", author: "John" };
    await booksCollection.insertOne(book);
    const cat = { name: "Kitty", kind: "Cat", owner: "John" };
    await petsCollection.insertOne(cat);
    const populatedDoc = await populate(usersCollection, insertedId, [
      {
        from: "books",
        localField: "name",
        foreignField: "author",
        as: "books",
      },
      {
        from: "pets",
        localField: "name",
        foreignField: "owner",
        as: "pets",
      },
    ]);
    expect(populatedDoc.books).toBeDefined();
    expect(populatedDoc.pets).toBeDefined();
    expect(populatedDoc.books.length).toBe(1);
    expect(populatedDoc.pets.length).toBe(1);
    expect(populatedDoc.books[0].title).toBe("Book");
    expect(populatedDoc.pets[0].name).toBe("Kitty");
  });

  // UpdateBuilder tests

  it("Should update a document", async () => {
    const collection = db.collection("users");
    const doc = { name: "John", age: 30, lastModified: new Date() };
    const { insertedId } = await collection.insertOne(doc);
    const builder = new UpdateBuilder<typeof doc>();
    builder
      .add("$set", { name: "Jane" })
      .add("$inc", { age: 1 })
      .add("$currentDate", { lastModified: true });
    const updates = builder.build();
    expect(updates).toEqual({
      $set: { name: "Jane" },
      $inc: { age: 1 },
      $currentDate: { lastModified: true },
    });
    const { matchedCount, modifiedCount } = await collection.updateOne(
      { _id: insertedId },
      updates,
    );
    expect(matchedCount).toBe(1);
    expect(modifiedCount).toBe(1);
  });
});
