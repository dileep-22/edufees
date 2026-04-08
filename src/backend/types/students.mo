import Common "common";

module {
  public type Student = {
    id : Common.StudentId;
    name : Text;
    studentId : Text; // external ID
    email : Text;
    group : Text; // cohort/group
    createdAt : Common.Timestamp;
    updatedAt : Common.Timestamp;
  };

  public type CreateStudentInput = {
    name : Text;
    studentId : Text;
    email : Text;
    group : Text;
  };

  public type UpdateStudentInput = {
    id : Common.StudentId;
    name : Text;
    studentId : Text;
    email : Text;
    group : Text;
  };

  public type CsvStudentRow = {
    name : Text;
    studentId : Text;
    email : Text;
    group : Text;
  };
};
