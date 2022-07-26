import type { Collection, Document, IndexDescription } from "mongodb";

export const ensureIndexes = async <TSchema extends Document = Document>(
  collection: Collection<TSchema>,
  dropOldIndexes: boolean,
  indexSpecs: IndexDescription[]
) => {
  if (dropOldIndexes) await collection.dropIndexes();
  await collection.createIndexes(indexSpecs);
};
