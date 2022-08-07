import { MongoServerError } from "mongodb";

export const isDocumentValidationError = (
  error: unknown,
): error is MongoServerError => {
  return (
    error instanceof MongoServerError &&
    error.code === 121 &&
    error.errInfo !== undefined
  );
};

export const isClassValidationError = (error: MongoServerError) =>
  error.errInfo !== undefined &&
  error.errInfo.details.operatorName === "$jsonSchema";
