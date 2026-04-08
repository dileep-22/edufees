import List "mo:core/List";
import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import Common "../types/common";
import FeeTypes "../types/fees";
import FeesLib "../lib/fees";

mixin (
  feeStructures : List.List<FeeTypes.FeeStructure>,
  feeIdCounter : Common.Counter,
  accessControlState : AccessControl.AccessControlState
) {
  public query ({ caller }) func listFeeStructures() : async [FeeTypes.FeeStructure] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: admin required");
    };
    FeesLib.listFeeStructures(feeStructures);
  };

  public query ({ caller }) func getFeeStructure(id : Common.FeeStructureId) : async ?FeeTypes.FeeStructure {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: admin required");
    };
    FeesLib.getFeeStructure(feeStructures, id);
  };

  public shared ({ caller }) func createFeeStructure(input : FeeTypes.CreateFeeStructureInput) : async FeeTypes.FeeStructure {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: admin required");
    };
    let fee = FeesLib.createFeeStructure(feeStructures, feeIdCounter.value, input);
    feeIdCounter.value += 1;
    fee;
  };

  public shared ({ caller }) func updateFeeStructure(input : FeeTypes.UpdateFeeStructureInput) : async ?FeeTypes.FeeStructure {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: admin required");
    };
    FeesLib.updateFeeStructure(feeStructures, input);
  };

  public shared ({ caller }) func deleteFeeStructure(id : Common.FeeStructureId) : async Bool {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: admin required");
    };
    FeesLib.deleteFeeStructure(feeStructures, id);
  };

  public shared ({ caller }) func duplicateFeeStructure(id : Common.FeeStructureId) : async ?FeeTypes.FeeStructure {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: admin required");
    };
    let result = FeesLib.duplicateFeeStructure(feeStructures, feeIdCounter.value, id);
    switch (result) {
      case (?_) { feeIdCounter.value += 1 };
      case null {};
    };
    result;
  };
};
