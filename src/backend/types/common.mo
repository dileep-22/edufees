module {
  public type Timestamp = Int;
  public type FeeStructureId = Nat;
  public type StudentId = Nat;
  public type PaymentId = Nat;
  public type AssignmentId = Nat;

  public type Counter = { var value : Nat };
  public func newCounter(start : Nat) : Counter { { var value = start } };
};
