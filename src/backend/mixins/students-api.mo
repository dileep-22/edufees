import List "mo:core/List";
import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import Common "../types/common";
import StudentTypes "../types/students";
import StudentsLib "../lib/students";

mixin (
  students : List.List<StudentTypes.Student>,
  studentIdCounter : Common.Counter,
  accessControlState : AccessControl.AccessControlState
) {
  public query ({ caller }) func listStudents() : async [StudentTypes.Student] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: admin required");
    };
    StudentsLib.listStudents(students);
  };

  public query ({ caller }) func getStudent(id : Common.StudentId) : async ?StudentTypes.Student {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: admin required");
    };
    StudentsLib.getStudent(students, id);
  };

  public shared ({ caller }) func createStudent(input : StudentTypes.CreateStudentInput) : async StudentTypes.Student {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: admin required");
    };
    let student = StudentsLib.createStudent(students, studentIdCounter.value, input);
    studentIdCounter.value += 1;
    student;
  };

  public shared ({ caller }) func updateStudent(input : StudentTypes.UpdateStudentInput) : async ?StudentTypes.Student {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: admin required");
    };
    StudentsLib.updateStudent(students, input);
  };

  public shared ({ caller }) func deleteStudent(id : Common.StudentId) : async Bool {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: admin required");
    };
    StudentsLib.deleteStudent(students, id);
  };

  public shared ({ caller }) func bulkImportStudents(rows : [StudentTypes.CsvStudentRow]) : async StudentTypes.ImportResult {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: admin required");
    };
    let result = StudentsLib.bulkImportStudents(students, studentIdCounter.value, rows);
    studentIdCounter.value += result.imported;
    result;
  };

  public query ({ caller }) func listStudentsByGroup(group : Text) : async [StudentTypes.Student] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: admin required");
    };
    StudentsLib.listStudentsByGroup(students, group);
  };
};
