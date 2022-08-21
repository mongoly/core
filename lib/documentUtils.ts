import type {
  Collection,
  UpdateFilter,
  UpdateOptions,
  FindOneAndUpdateOptions,
  FindOneAndDeleteOptions,
  Document,
  InferIdType,
} from "mongodb";

export const findById = <TSchema, IdType = InferIdType<TSchema>>(
  collection: Collection<TSchema>,
  documentId: IdType,
) => collection.findOne({ _id: documentId });

export const findByIdAndUpdate = <TSchema, IdType = InferIdType<TSchema>>(
  collection: Collection<TSchema>,
  documentId: IdType,
  update: UpdateFilter<TSchema>,
  options: FindOneAndUpdateOptions = {},
) => collection.findOneAndUpdate({ _id: documentId }, update, options);

export const findByIdAndDelete = <TSchema, IdType = InferIdType<TSchema>>(
  collection: Collection<TSchema>,
  documentId: IdType,
  options: FindOneAndDeleteOptions = {},
) => collection.findOneAndDelete({ _id: documentId }, options);

export const updateById = <TSchema, IdType = InferIdType<TSchema>>(
  collection: Collection<TSchema>,
  documentId: IdType,
  update: UpdateFilter<TSchema>,
  options: UpdateOptions = {},
) => collection.updateOne({ _id: documentId }, update, options);

export const deleteById = <TSchema, IdType = InferIdType<TSchema>>(
  collection: Collection<TSchema>,
  documentId: IdType,
) => collection.deleteOne({ _id: documentId });

export const save = <TSchema extends Document>(
  collection: Collection<TSchema>,
  doc: TSchema,
  upsert = true,
) => updateById(collection, doc._id, { $set: doc }, { upsert });

export type PopulateOptions = {
  from: string;
  foreignField: string;
  localField: string;
  as: string;
  relationship: "one" | "many";
};

export const populate = async <TSchema, IdType>(
  collection: Collection<TSchema>,
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
  return results[0];
};
