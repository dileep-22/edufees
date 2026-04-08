import List "mo:core/List";
import Time "mo:core/Time";
import Common "../types/common";
import StudentTypes "../types/students";

module {
  public func listStudents(
    students : List.List<StudentTypes.Student>
  ) : [StudentTypes.Student] {
    students.toArray();
  };

  public func getStudent(
    students : List.List<StudentTypes.Student>,
    id : Common.StudentId
  ) : ?StudentTypes.Student {
    students.find(func(s) { s.id == id });
  };

  public func createStudent(
    students : List.List<StudentTypes.Student>,
    nextId : Nat,
    input : StudentTypes.CreateStudentInput
  ) : StudentTypes.Student {
    let now = Time.now();
    let student : StudentTypes.Student = {
      id = nextId;
      name = input.name;
      studentId = input.studentId;
      email = input.email;
      group = input.group;
      createdAt = now;
      updatedAt = now;
    };
    students.add(student);
    student;
  };

  public func updateStudent(
    students : List.List<StudentTypes.Student>,
    input : StudentTypes.UpdateStudentInput
  ) : ?StudentTypes.Student {
    var updated : ?StudentTypes.Student = null;
    let now = Time.now();
    students.mapInPlace(
      func(s) {
        if (s.id == input.id) {
          let u : StudentTypes.Student = {
            s with
            name = input.name;
            studentId = input.studentId;
            email = input.email;
            group = input.group;
            updatedAt = now;
          };
          updated := ?u;
          u;
        } else { s };
      }
    );
    updated;
  };

  public func deleteStudent(
    students : List.List<StudentTypes.Student>,
    id : Common.StudentId
  ) : Bool {
    let sizeBefore = students.size();
    let filtered = students.filter(func(s) { s.id != id });
    students.clear();
    students.append(filtered);
    students.size() < sizeBefore;
  };

  public func bulkImportStudents(
    students : List.List<StudentTypes.Student>,
    nextId : Nat,
    rows : [StudentTypes.CsvStudentRow]
  ) : StudentTypes.ImportResult {
    let now = Time.now();
    var currentId = nextId;
    var imported : Nat = 0;
    let errors = List.empty<StudentTypes.ImportRowError>();

    var rowIdx : Nat = 0;
    for (row in rows.values()) {
      var rowErrors = List.empty<StudentTypes.ImportRowError>();

      // Validate name
      if (row.name.size() == 0) {
        rowErrors.add({ row = rowIdx; field = "name"; value = row.name; message = "Name is required" });
      };

      // Validate studentId
      if (row.studentId.size() == 0) {
        rowErrors.add({ row = rowIdx; field = "studentId"; value = row.studentId; message = "Student ID is required" });
      } else {
        // Check for duplicate studentId in existing students
        switch (students.find(func(s) { s.studentId == row.studentId })) {
          case (?_) {
            rowErrors.add({ row = rowIdx; field = "studentId"; value = row.studentId; message = "Student ID already exists" });
          };
          case null {};
        };
      };

      // Validate email (basic: must contain @)
      if (row.email.size() == 0) {
        rowErrors.add({ row = rowIdx; field = "email"; value = row.email; message = "Email is required" });
      } else if (not row.email.contains(#char '@')) {
        rowErrors.add({ row = rowIdx; field = "email"; value = row.email; message = "Email must contain @" });
      };

      // Validate group
      if (row.group.size() == 0) {
        rowErrors.add({ row = rowIdx; field = "group"; value = row.group; message = "Group is required" });
      };

      if (rowErrors.size() == 0) {
        // No errors: import this row
        let student : StudentTypes.Student = {
          id = currentId;
          name = row.name;
          studentId = row.studentId;
          email = row.email;
          group = row.group;
          createdAt = now;
          updatedAt = now;
        };
        students.add(student);
        currentId += 1;
        imported += 1;
      } else {
        errors.append(rowErrors);
      };

      rowIdx += 1;
    };

    { imported = imported; errors = errors.toArray() };
  };

  public func listStudentsByGroup(
    students : List.List<StudentTypes.Student>,
    group : Text
  ) : [StudentTypes.Student] {
    students.filter(func(s) { s.group == group }).toArray();
  };
};
