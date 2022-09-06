import type { Collection, Document, IndexDescription } from "mongodb";

export const ensureIndexes = async <TSchema extends Document = Document>(
  collection: Collection<TSchema>,
  indexDescriptions: IndexDescription[],
  dropIndexes?: boolean,
) => {
  if (dropIndexes) await collection.dropIndexes();
  await collection.createIndexes(indexDescriptions);
};
