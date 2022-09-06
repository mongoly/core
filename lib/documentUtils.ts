import {
  Collection,
  Document,
  InferIdType,
  FindOptions,
  UpdateFilter,
  UpdateOptions,
  DeleteOptions,
  FindOneAndUpdateOptions,
  FindOneAndDeleteOptions,
} from "mongodb";

export const findById = <TSchema extends Document = Document>(
  collection: Collection<TSchema>,
  documentId: InferIdType<TSchema>,
  options?: FindOptions,
) => {
  return collection.findOne({ _id: documentId as any }, options);
};

export const updateById = <TSchema extends Document = Document>(
  collection: Collection<TSchema>,
  documentId: InferIdType<TSchema>,
  update: UpdateFilter<TSchema>,
  options: UpdateOptions = {},
) => collection.updateOne({ _id: documentId as any }, update, options);

export const deleteById = <TSchema extends Document = Document>(
  collection: Collection<TSchema>,
  documentId: InferIdType<TSchema>,
  options: DeleteOptions = {},
) => collection.deleteOne({ _id: documentId as any }, options);

export const findByIdAndUpdate = <TSchema extends Document = Document>(
  collection: Collection<TSchema>,
  documentId: InferIdType<TSchema>,
  update: UpdateFilter<TSchema>,
  options: FindOneAndUpdateOptions = {},
) => collection.findOneAndUpdate({ _id: documentId as any }, update, options);

export const findByIdAndDelete = <TSchema extends Document = Document>(
  collection: Collection<TSchema>,
  documentId: InferIdType<TSchema>,
  options: FindOneAndDeleteOptions = {},
) => collection.findOneAndDelete({ _id: documentId as any }, options);

export const save = <TSchema extends Document = Document>(
  collection: Collection<TSchema>,
  document: TSchema,
  upsert = true,
) => {
  return updateById(collection, document._id, { $set: document }, { upsert });
};

export type PopulateOptions = {
  from: string;
  foreignField: string;
  localField: string;
  as: string;
  relationship: "one" | "many";
};

export const populate = async <IdType>(
  collection: Collection,
  documentIdOrIds: IdType,
  populations: PopulateOptions[],
) => {
  const cursor = collection.aggregate();
  if (Array.isArray(documentIdOrIds))
    cursor.match({ _id: { $in: documentIdOrIds } });
  else cursor.match({ _id: documentIdOrIds });
  for (const population of populations) {
    cursor.lookup({
      from: population.from,
      localField: population.localField,
      foreignField: population.foreignField,
      as: population.as,
    });
    if (population.relationship === "one")
      cursor.unwind({ path: population.as });
  }
  const results = await cursor.toArray();
  if (Array.isArray(documentIdOrIds)) return results;
  const [result] = results;
  return result;
};
