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
  documentId: IdType
) => collection.findOne({ _id: documentId });

export const findByIdAndUpdate = <TSchema, IdType = InferIdType<TSchema>>(
  collection: Collection<TSchema>,
  documentId: IdType,
  update: UpdateFilter<TSchema>,
  options: FindOneAndUpdateOptions = {}
) => collection.findOneAndUpdate({ _id: documentId }, update, options);

export const findByIdAndDelete = <TSchema, IdType = InferIdType<TSchema>>(
  collection: Collection<TSchema>,
  documentId: IdType,
  options: FindOneAndDeleteOptions = {}
) => collection.findOneAndDelete({ _id: documentId }, options);

export const updateById = <TSchema, IdType = InferIdType<TSchema>>(
  collection: Collection<TSchema>,
  documentId: IdType,
  update: UpdateFilter<TSchema>,
  options: UpdateOptions = {}
) => collection.updateOne({ _id: documentId }, update, options);

export const deleteById = <TSchema, IdType = InferIdType<TSchema>>(
  collection: Collection<TSchema>,
  documentId: IdType
) => collection.deleteOne({ _id: documentId });

export const save = <TSchema extends Document>(
  collection: Collection<TSchema>,
  doc: TSchema,
  upsert = true
) => updateById(collection, doc._id, { $set: doc }, { upsert });

export type PopulateOptions = {
  from: string;
  foreignField: string;
  localField: string;
  as: string;
};

export const populate = async <TSchema, IdType = InferIdType<TSchema>>(
  collection: Collection<TSchema>,
  documentId: IdType,
  populations: PopulateOptions[]
) => {
  const [populatedDoc] = await collection
    .aggregate([
      { $match: { _id: documentId } },
      ...populations.map((populate) => ({
        $lookup: {
          from: populate.from,
          localField: populate.localField,
          foreignField: populate.foreignField,
          as: populate.as,
        },
      })),
    ])
    .toArray();
  return populatedDoc;
};

export const populateMany = async <TSchema, IdType = InferIdType<TSchema>>(
  collection: Collection<TSchema>,
  documentIds: IdType[],
  populations: PopulateOptions[]
) => {
  const populatedDocs = await collection
    .aggregate([
      { $match: { _id: { $in: documentIds } } },
      ...populations.map((populate) => ({
        $lookup: {
          from: populate.from,
          localField: populate.localField,
          foreignField: populate.foreignField,
          as: populate.as,
        },
      })),
    ])
    .toArray();
  return populatedDocs;
};
