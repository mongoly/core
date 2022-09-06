import type { Document, UpdateFilter } from "mongodb";

export type UpdateOperator =
  | "$addToSet"
  | "$bit"
  | "$currentDate"
  | "$inc"
  | "$min"
  | "$max"
  | "$mul"
  | "$pop"
  | "$pull"
  | "$pullAll"
  | "$push"
  | "$rename"
  | "$set"
  | "$setOnInsert"
  | "$unset";

type UpdateStrategy = "merge" | "replace";

export class UpdateBuilder<TSchema extends Document = Document> {
  private updateStrategy = "merge";

  private readonly currentUpdates = new Map<
    UpdateOperator,
    UpdateFilter<TSchema>[UpdateOperator]
  >();

  setUpdateStrategy(strategy: UpdateStrategy) {
    this.updateStrategy = strategy;
    return this;
  }

  add<
    Operator extends UpdateOperator,
    Updates extends UpdateFilter<TSchema>[Operator],
  >(operator: Operator, newOperatorUpdates: Updates) {
    let operatorUpdates = this.currentUpdates.get(operator);
    if (!operatorUpdates) operatorUpdates = {};
    this.currentUpdates.set(
      operator,
      this.updateStrategy === "merge"
        ? { ...operatorUpdates, ...newOperatorUpdates }
        : newOperatorUpdates,
    );
    return this;
  }

  build(): UpdateFilter<TSchema> {
    const updateFilter: any = {};
    this.currentUpdates.forEach((operatorUpdates, operator) => {
      updateFilter[operator] = operatorUpdates;
    });
    return updateFilter;
  }
}
