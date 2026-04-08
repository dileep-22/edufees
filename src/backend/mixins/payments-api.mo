import List "mo:core/List";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import Common "../types/common";
import PaymentTypes "../types/payments";
import StudentTypes "../types/students";
import FeeTypes "../types/fees";
import PaymentsLib "../lib/payments";

mixin (
  payments : List.List<PaymentTypes.Payment>,
  assignments : List.List<PaymentTypes.FeeAssignment>,
  students : List.List<StudentTypes.Student>,
  feeStructures : List.List<FeeTypes.FeeStructure>,
  paymentIdCounter : Common.Counter,
  assignmentIdCounter : Common.Counter,
  accessControlState : AccessControl.AccessControlState
) {
  public shared ({ caller }) func recordPayment(input : PaymentTypes.RecordPaymentInput) : async { #ok : PaymentTypes.Payment; #err : PaymentTypes.RecordPaymentError } {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: admin required");
    };
    let result = PaymentsLib.recordPayment(payments, assignments, feeStructures, paymentIdCounter.value, input);
    switch (result) {
      case (#ok(_)) { paymentIdCounter.value += 1 };
      case (#err(_)) {};
    };
    result;
  };

  public query ({ caller }) func checkReceiptExists(receiptNumber : Text) : async Bool {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: admin required");
    };
    PaymentsLib.checkReceiptExists(payments, receiptNumber);
  };

  public shared ({ caller }) func assignFeeToStudent(studentId : Common.StudentId, feeStructureId : Common.FeeStructureId) : async PaymentTypes.FeeAssignment {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: admin required");
    };
    let assignment = PaymentsLib.assignFeeToStudent(assignments, assignmentIdCounter.value, studentId, feeStructureId);
    if (assignment.id == assignmentIdCounter.value) {
      assignmentIdCounter.value += 1;
    };
    assignment;
  };

  public shared ({ caller }) func assignFeeToGroup(group : Text, feeStructureId : Common.FeeStructureId) : async [PaymentTypes.FeeAssignment] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: admin required");
    };
    let created = PaymentsLib.assignFeeToGroup(assignments, students, assignmentIdCounter.value, group, feeStructureId);
    assignmentIdCounter.value += created.size();
    created;
  };

  public shared ({ caller }) func unenrollStudent(studentId : Common.StudentId, feeStructureId : Common.FeeStructureId) : async Bool {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: admin required");
    };
    PaymentsLib.unenrollStudent(assignments, studentId, feeStructureId);
  };

  public shared ({ caller }) func waiveFee(studentId : Common.StudentId, feeStructureId : Common.FeeStructureId, reason : Text) : async ?PaymentTypes.FeeAssignment {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: admin required");
    };
    PaymentsLib.waiveFee(assignments, studentId, feeStructureId, reason);
  };

  public query ({ caller }) func getStudentBalances(studentId : Common.StudentId) : async [PaymentTypes.StudentBalance] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: admin required");
    };
    PaymentsLib.getStudentBalances(assignments, payments, students, feeStructures, studentId);
  };

  public query ({ caller }) func getFeeStructureBalances(feeStructureId : Common.FeeStructureId) : async [PaymentTypes.StudentBalance] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: admin required");
    };
    PaymentsLib.getFeeStructureBalances(assignments, payments, students, feeStructures, feeStructureId);
  };

  public query ({ caller }) func getCollectionSummary() : async PaymentTypes.CollectionSummary {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: admin required");
    };
    PaymentsLib.getCollectionSummary(assignments, payments, feeStructures);
  };

  public query ({ caller }) func getCollectionTrends() : async PaymentTypes.CollectionTrends {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: admin required");
    };
    PaymentsLib.getCollectionTrends(payments);
  };

  public query ({ caller }) func getPaymentsByDateRange(fromDate : Common.Timestamp, toDate : Common.Timestamp) : async [PaymentTypes.Payment] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: admin required");
    };
    PaymentsLib.getPaymentsByDateRange(payments, fromDate, toDate);
  };

  public query ({ caller }) func getAllBalances() : async [PaymentTypes.StudentBalance] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: admin required");
    };
    PaymentsLib.getAllBalances(assignments, payments, students, feeStructures);
  };

  public shared ({ caller }) func getAgingReport() : async [PaymentTypes.AgingBucket] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: admin required");
    };
    PaymentsLib.getAgingReport(assignments, payments, students, feeStructures, Time.now());
  };

  public shared ({ caller }) func getAgingReportDetail(bucketIndex : Nat) : async [PaymentTypes.AgingBucketDetail] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: admin required");
    };
    PaymentsLib.getAgingReportDetail(assignments, payments, students, feeStructures, Time.now(), bucketIndex);
  };

  public query ({ caller }) func getPaymentMethodBreakdown() : async PaymentTypes.PaymentMethodBreakdown {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: admin required");
    };
    PaymentsLib.getPaymentMethodBreakdown(payments);
  };

  public shared ({ caller }) func updateOverdueStatuses() : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: admin required");
    };
    PaymentsLib.updateOverdueStatuses(assignments, feeStructures, Time.now());
  };
};
