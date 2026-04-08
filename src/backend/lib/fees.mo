import List "mo:core/List";
import Time "mo:core/Time";
import Common "../types/common";
import FeeTypes "../types/fees";

module {
  public func listFeeStructures(
    feeStructures : List.List<FeeTypes.FeeStructure>
  ) : [FeeTypes.FeeStructure] {
    feeStructures.toArray();
  };

  public func getFeeStructure(
    feeStructures : List.List<FeeTypes.FeeStructure>,
    id : Common.FeeStructureId
  ) : ?FeeTypes.FeeStructure {
    feeStructures.find(func(f) { f.id == id });
  };

  public func createFeeStructure(
    feeStructures : List.List<FeeTypes.FeeStructure>,
    nextId : Nat,
    input : FeeTypes.CreateFeeStructureInput
  ) : FeeTypes.FeeStructure {
    let now = Time.now();
    let fee : FeeTypes.FeeStructure = {
      id = nextId;
      name = input.name;
      description = input.description;
      amount = input.amount;
      period = input.period;
      startDate = input.startDate;
      endDate = input.endDate;
      dueDate = input.dueDate;
      latePenalty = input.latePenalty;
      createdAt = now;
      updatedAt = now;
    };
    feeStructures.add(fee);
    fee;
  };

  public func updateFeeStructure(
    feeStructures : List.List<FeeTypes.FeeStructure>,
    input : FeeTypes.UpdateFeeStructureInput
  ) : ?FeeTypes.FeeStructure {
    var updated : ?FeeTypes.FeeStructure = null;
    let now = Time.now();
    feeStructures.mapInPlace(
      func(f) {
        if (f.id == input.id) {
          let u : FeeTypes.FeeStructure = {
            f with
            name = input.name;
            description = input.description;
            amount = input.amount;
            period = input.period;
            startDate = input.startDate;
            endDate = input.endDate;
            dueDate = input.dueDate;
            latePenalty = input.latePenalty;
            updatedAt = now;
          };
          updated := ?u;
          u;
        } else { f };
      }
    );
    updated;
  };

  public func deleteFeeStructure(
    feeStructures : List.List<FeeTypes.FeeStructure>,
    id : Common.FeeStructureId
  ) : Bool {
    let sizeBefore = feeStructures.size();
    let filtered = feeStructures.filter(func(f) { f.id != id });
    feeStructures.clear();
    feeStructures.append(filtered);
    feeStructures.size() < sizeBefore;
  };

  public func duplicateFeeStructure(
    feeStructures : List.List<FeeTypes.FeeStructure>,
    nextId : Nat,
    id : Common.FeeStructureId
  ) : ?FeeTypes.FeeStructure {
    switch (feeStructures.find(func(f) { f.id == id })) {
      case null { null };
      case (?original) {
        let now = Time.now();
        let copy : FeeTypes.FeeStructure = {
          original with
          id = nextId;
          name = original.name # " (Copy)";
          createdAt = now;
          updatedAt = now;
        };
        feeStructures.add(copy);
        ?copy;
      };
    };
  };
};
