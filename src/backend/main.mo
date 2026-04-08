import List "mo:core/List";
import AccessControl "mo:caffeineai-authorization/access-control";
import MixinAuthorization "mo:caffeineai-authorization/MixinAuthorization";
import Common "types/common";
import FeeTypes "types/fees";
import StudentTypes "types/students";
import PaymentTypes "types/payments";
import FeesApi "mixins/fees-api";
import StudentsApi "mixins/students-api";
import PaymentsApi "mixins/payments-api";

actor {
  let accessControlState = AccessControl.initState();

  let feeStructures = List.empty<FeeTypes.FeeStructure>();
  let feeIdCounter = Common.newCounter(1);

  let students = List.empty<StudentTypes.Student>();
  let studentIdCounter = Common.newCounter(1);

  let payments = List.empty<PaymentTypes.Payment>();
  let assignments = List.empty<PaymentTypes.FeeAssignment>();
  let paymentIdCounter = Common.newCounter(1);
  let assignmentIdCounter = Common.newCounter(1);

  include MixinAuthorization(accessControlState);
  include FeesApi(feeStructures, feeIdCounter, accessControlState);
  include StudentsApi(students, studentIdCounter, accessControlState);
  include PaymentsApi(payments, assignments, students, feeStructures, paymentIdCounter, assignmentIdCounter, accessControlState);
};
