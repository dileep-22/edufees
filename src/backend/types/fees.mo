import Common "common";

module {
  public type FeePeriod = {
    #term;
    #semester;
    #annual;
    #monthly;
  };

  public type LatePenalty = {
    #fixed : Nat;
    #percentage : Nat; // basis points (e.g. 500 = 5.00%)
  };

  public type FeeStructure = {
    id : Common.FeeStructureId;
    name : Text;
    description : Text;
    amount : Nat; // in cents
    period : FeePeriod;
    startDate : Common.Timestamp;
    endDate : Common.Timestamp;
    dueDate : Common.Timestamp;
    latePenalty : ?LatePenalty;
    createdAt : Common.Timestamp;
    updatedAt : Common.Timestamp;
  };

  public type CreateFeeStructureInput = {
    name : Text;
    description : Text;
    amount : Nat;
    period : FeePeriod;
    startDate : Common.Timestamp;
    endDate : Common.Timestamp;
    dueDate : Common.Timestamp;
    latePenalty : ?LatePenalty;
  };

  public type UpdateFeeStructureInput = {
    id : Common.FeeStructureId;
    name : Text;
    description : Text;
    amount : Nat;
    period : FeePeriod;
    startDate : Common.Timestamp;
    endDate : Common.Timestamp;
    dueDate : Common.Timestamp;
    latePenalty : ?LatePenalty;
  };
};
