import List "mo:core/List";
import Time "mo:core/Time";
import Common "../types/common";
import PaymentTypes "../types/payments";
import StudentTypes "../types/students";
import FeeTypes "../types/fees";

module {
  // Helper: sum payments for a given student+fee assignment
  func paidAmountFor(
    payments : List.List<PaymentTypes.Payment>,
    studentId : Common.StudentId,
    feeStructureId : Common.FeeStructureId
  ) : Nat {
    var total : Nat = 0;
    payments.forEach(func(p) {
      if (p.studentId == studentId and p.feeStructureId == feeStructureId) {
        total += p.amount;
      };
    });
    total;
  };

  public func recordPayment(
    payments : List.List<PaymentTypes.Payment>,
    assignments : List.List<PaymentTypes.FeeAssignment>,
    feeStructures : List.List<FeeTypes.FeeStructure>,
    nextId : Nat,
    input : PaymentTypes.RecordPaymentInput
  ) : PaymentTypes.Payment {
    let now = Time.now();
    let payment : PaymentTypes.Payment = {
      id = nextId;
      studentId = input.studentId;
      feeStructureId = input.feeStructureId;
      date = input.date;
      amount = input.amount;
      method = input.method;
      receiptNumber = input.receiptNumber;
      notes = input.notes;
      createdAt = now;
    };
    payments.add(payment);

    // Update assignment status based on total paid vs fee amount
    assignments.mapInPlace(
      func(a) {
        if (a.studentId == input.studentId and a.feeStructureId == input.feeStructureId and a.status != #waived) {
          let totalPaid = paidAmountFor(payments, input.studentId, input.feeStructureId);
          let newStatus : PaymentTypes.PaymentStatus = switch (feeStructures.find(func(f) { f.id == input.feeStructureId })) {
            case (?fee) {
              if (totalPaid >= fee.amount) { #paid }
              else if (totalPaid > 0) { #partial }
              else { #pending };
            };
            case null {
              if (totalPaid > 0) { #partial } else { #pending };
            };
          };
          { a with status = newStatus; updatedAt = now };
        } else { a };
      }
    );
    payment;
  };

  public func assignFeeToStudent(
    assignments : List.List<PaymentTypes.FeeAssignment>,
    nextId : Nat,
    studentId : Common.StudentId,
    feeStructureId : Common.FeeStructureId
  ) : PaymentTypes.FeeAssignment {
    // Check if already assigned
    switch (assignments.find(func(a) { a.studentId == studentId and a.feeStructureId == feeStructureId })) {
      case (?existing) { existing };
      case null {
        let now = Time.now();
        let assignment : PaymentTypes.FeeAssignment = {
          id = nextId;
          studentId = studentId;
          feeStructureId = feeStructureId;
          status = #pending;
          waivedReason = null;
          assignedAt = now;
          updatedAt = now;
        };
        assignments.add(assignment);
        assignment;
      };
    };
  };

  public func assignFeeToGroup(
    assignments : List.List<PaymentTypes.FeeAssignment>,
    students : List.List<StudentTypes.Student>,
    nextAssignmentId : Nat,
    group : Text,
    feeStructureId : Common.FeeStructureId
  ) : [PaymentTypes.FeeAssignment] {
    let now = Time.now();
    var currentId = nextAssignmentId;
    let created = List.empty<PaymentTypes.FeeAssignment>();
    let groupStudents = students.filter(func(s) { s.group == group });
    groupStudents.forEach(
      func(s) {
        // Only assign if not already assigned
        let alreadyAssigned = assignments.find(
          func(a) { a.studentId == s.id and a.feeStructureId == feeStructureId }
        );
        switch (alreadyAssigned) {
          case (?_) {};
          case null {
            let assignment : PaymentTypes.FeeAssignment = {
              id = currentId;
              studentId = s.id;
              feeStructureId = feeStructureId;
              status = #pending;
              waivedReason = null;
              assignedAt = now;
              updatedAt = now;
            };
            assignments.add(assignment);
            created.add(assignment);
            currentId += 1;
          };
        };
      }
    );
    created.toArray();
  };

  public func unenrollStudent(
    assignments : List.List<PaymentTypes.FeeAssignment>,
    studentId : Common.StudentId,
    feeStructureId : Common.FeeStructureId
  ) : Bool {
    let sizeBefore = assignments.size();
    let filtered = assignments.filter(
      func(a) { not (a.studentId == studentId and a.feeStructureId == feeStructureId) }
    );
    assignments.clear();
    assignments.append(filtered);
    assignments.size() < sizeBefore;
  };

  public func waiveFee(
    assignments : List.List<PaymentTypes.FeeAssignment>,
    studentId : Common.StudentId,
    feeStructureId : Common.FeeStructureId,
    reason : Text
  ) : ?PaymentTypes.FeeAssignment {
    var waived : ?PaymentTypes.FeeAssignment = null;
    let now = Time.now();
    assignments.mapInPlace(
      func(a) {
        if (a.studentId == studentId and a.feeStructureId == feeStructureId) {
          let u : PaymentTypes.FeeAssignment = {
            a with
            status = #waived;
            waivedReason = ?reason;
            updatedAt = now;
          };
          waived := ?u;
          u;
        } else { a };
      }
    );
    waived;
  };

  func buildStudentBalance(
    a : PaymentTypes.FeeAssignment,
    payments : List.List<PaymentTypes.Payment>,
    students : List.List<StudentTypes.Student>,
    feeStructures : List.List<FeeTypes.FeeStructure>
  ) : ?PaymentTypes.StudentBalance {
    let studentOpt = students.find(func(s) { s.id == a.studentId });
    let feeOpt = feeStructures.find(func(f) { f.id == a.feeStructureId });
    switch (studentOpt, feeOpt) {
      case (?student, ?fee) {
        let paid = paidAmountFor(payments, a.studentId, a.feeStructureId);
        let outstanding = if (paid >= fee.amount) { 0 } else { fee.amount - paid };
        ?{
          studentId = a.studentId;
          studentName = student.name;
          feeStructureId = a.feeStructureId;
          feeStructureName = fee.name;
          totalAmount = fee.amount;
          paidAmount = paid;
          outstandingAmount = outstanding;
          status = a.status;
          dueDate = fee.dueDate;
        };
      };
      case _ { null };
    };
  };

  public func getStudentBalances(
    assignments : List.List<PaymentTypes.FeeAssignment>,
    payments : List.List<PaymentTypes.Payment>,
    students : List.List<StudentTypes.Student>,
    feeStructures : List.List<FeeTypes.FeeStructure>,
    studentId : Common.StudentId
  ) : [PaymentTypes.StudentBalance] {
    let result = List.empty<PaymentTypes.StudentBalance>();
    assignments.forEach(func(a) {
      if (a.studentId == studentId) {
        switch (buildStudentBalance(a, payments, students, feeStructures)) {
          case (?b) { result.add(b) };
          case null {};
        };
      };
    });
    result.toArray();
  };

  public func getFeeStructureBalances(
    assignments : List.List<PaymentTypes.FeeAssignment>,
    payments : List.List<PaymentTypes.Payment>,
    students : List.List<StudentTypes.Student>,
    feeStructures : List.List<FeeTypes.FeeStructure>,
    feeStructureId : Common.FeeStructureId
  ) : [PaymentTypes.StudentBalance] {
    let result = List.empty<PaymentTypes.StudentBalance>();
    assignments.forEach(func(a) {
      if (a.feeStructureId == feeStructureId) {
        switch (buildStudentBalance(a, payments, students, feeStructures)) {
          case (?b) { result.add(b) };
          case null {};
        };
      };
    });
    result.toArray();
  };

  public func getCollectionSummary(
    assignments : List.List<PaymentTypes.FeeAssignment>,
    payments : List.List<PaymentTypes.Payment>,
    feeStructures : List.List<FeeTypes.FeeStructure>
  ) : PaymentTypes.CollectionSummary {
    var totalCollected : Nat = 0;
    payments.forEach(func(p) { totalCollected += p.amount });
    var totalOutstanding : Nat = 0;
    var totalOverdue : Nat = 0;
    var totalWaived : Nat = 0;

    assignments.forEach(
      func(a) {
        switch (feeStructures.find(func(f) { f.id == a.feeStructureId })) {
          case null {};
          case (?fee) {
            let paid = paidAmountFor(payments, a.studentId, a.feeStructureId);
            let outstanding = if (paid >= fee.amount) { 0 } else { fee.amount - paid };
            switch (a.status) {
              case (#waived) { totalWaived += fee.amount };
              case (#overdue) { totalOutstanding += outstanding; totalOverdue += outstanding };
              case (#pending) { totalOutstanding += outstanding };
              case (#partial) { totalOutstanding += outstanding };
              case (#paid) {};
            };
          };
        };
      }
    );

    {
      totalCollected = totalCollected;
      totalOutstanding = totalOutstanding;
      totalOverdue = totalOverdue;
      totalWaived = totalWaived;
      paymentCount = payments.size();
    };
  };

  public func getPaymentsByDateRange(
    payments : List.List<PaymentTypes.Payment>,
    fromDate : Common.Timestamp,
    toDate : Common.Timestamp
  ) : [PaymentTypes.Payment] {
    payments.filter(func(p) { p.date >= fromDate and p.date <= toDate }).toArray();
  };

  public func getAllBalances(
    assignments : List.List<PaymentTypes.FeeAssignment>,
    payments : List.List<PaymentTypes.Payment>,
    students : List.List<StudentTypes.Student>,
    feeStructures : List.List<FeeTypes.FeeStructure>
  ) : [PaymentTypes.StudentBalance] {
    let result = List.empty<PaymentTypes.StudentBalance>();
    assignments.forEach(func(a) {
      switch (buildStudentBalance(a, payments, students, feeStructures)) {
        case (?b) { result.add(b) };
        case null {};
      };
    });
    result.toArray();
  };

  public func getAgingReport(
    assignments : List.List<PaymentTypes.FeeAssignment>,
    payments : List.List<PaymentTypes.Payment>,
    students : List.List<StudentTypes.Student>,
    feeStructures : List.List<FeeTypes.FeeStructure>,
    now : Common.Timestamp
  ) : [PaymentTypes.AgingBucket] {
    // nanoseconds per day
    let dayNs : Int = 86_400_000_000_000;
    var count0_30 : Nat = 0;
    var amount0_30 : Nat = 0;
    var count30_60 : Nat = 0;
    var amount30_60 : Nat = 0;
    var count60plus : Nat = 0;
    var amount60plus : Nat = 0;

    assignments.forEach(
      func(a) {
        if (a.status == #overdue) {
          switch (feeStructures.find(func(f) { f.id == a.feeStructureId })) {
            case null {};
            case (?fee) {
              let paid = paidAmountFor(payments, a.studentId, a.feeStructureId);
              let outstanding = if (paid >= fee.amount) { 0 } else { fee.amount - paid };
              if (outstanding > 0) {
                let daysOverdue = (now - fee.dueDate) / dayNs;
                if (daysOverdue <= 30) {
                  count0_30 += 1;
                  amount0_30 += outstanding;
                } else if (daysOverdue <= 60) {
                  count30_60 += 1;
                  amount30_60 += outstanding;
                } else {
                  count60plus += 1;
                  amount60plus += outstanding;
                };
              };
            };
          };
        };
      }
    );

    [
      { bucket = "0-30"; count = count0_30; totalAmount = amount0_30 },
      { bucket = "30-60"; count = count30_60; totalAmount = amount30_60 },
      { bucket = "60+"; count = count60plus; totalAmount = amount60plus },
    ];
  };

  public func getPaymentMethodBreakdown(
    payments : List.List<PaymentTypes.Payment>
  ) : PaymentTypes.PaymentMethodBreakdown {
    var cash : Nat = 0;
    var check : Nat = 0;
    var transfer : Nat = 0;
    var online : Nat = 0;

    payments.forEach(
      func(p) {
        switch (p.method) {
          case (#cash) { cash += p.amount };
          case (#check) { check += p.amount };
          case (#transfer) { transfer += p.amount };
          case (#online) { online += p.amount };
        };
      }
    );

    { cash = cash; check = check; transfer = transfer; online = online };
  };

  public func updateOverdueStatuses(
    assignments : List.List<PaymentTypes.FeeAssignment>,
    feeStructures : List.List<FeeTypes.FeeStructure>,
    now : Common.Timestamp
  ) : () {
    assignments.mapInPlace(
      func(a) {
        if (a.status == #waived or a.status == #paid) {
          a;
        } else {
          switch (feeStructures.find(func(f) { f.id == a.feeStructureId })) {
            case null { a };
            case (?fee) {
              if (now > fee.dueDate and (a.status == #pending or a.status == #partial)) {
                { a with status = #overdue; updatedAt = now };
              } else { a };
            };
          };
        };
      }
    );
  };
};
