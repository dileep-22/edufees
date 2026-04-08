import Common "common";

module {
  public type PaymentMethod = {
    #cash;
    #check;
    #transfer;
    #online;
  };

  public type PaymentStatus = {
    #pending;
    #partial;
    #paid;
    #overdue;
    #waived;
  };

  public type Payment = {
    id : Common.PaymentId;
    studentId : Common.StudentId;
    feeStructureId : Common.FeeStructureId;
    date : Common.Timestamp;
    amount : Nat; // in cents
    method : PaymentMethod;
    receiptNumber : Text;
    notes : Text;
    createdAt : Common.Timestamp;
  };

  public type RecordPaymentInput = {
    studentId : Common.StudentId;
    feeStructureId : Common.FeeStructureId;
    date : Common.Timestamp;
    amount : Nat;
    method : PaymentMethod;
    receiptNumber : Text;
    notes : Text;
  };

  public type FeeAssignment = {
    id : Common.AssignmentId;
    studentId : Common.StudentId;
    feeStructureId : Common.FeeStructureId;
    status : PaymentStatus;
    waivedReason : ?Text;
    assignedAt : Common.Timestamp;
    updatedAt : Common.Timestamp;
  };

  public type StudentBalance = {
    studentId : Common.StudentId;
    studentName : Text;
    feeStructureId : Common.FeeStructureId;
    feeStructureName : Text;
    totalAmount : Nat;
    paidAmount : Nat;
    outstandingAmount : Nat;
    status : PaymentStatus;
    dueDate : Common.Timestamp;
  };

  public type CollectionSummary = {
    totalCollected : Nat;
    totalOutstanding : Nat;
    totalOverdue : Nat;
    totalWaived : Nat;
    paymentCount : Nat;
  };

  public type PaymentMethodBreakdown = {
    cash : Nat;
    check : Nat;
    transfer : Nat;
    online : Nat;
  };

  public type AgingBucket = {
    bucket : Text; // "0-30", "30-60", "60+"
    count : Nat;
    totalAmount : Nat;
  };
};
