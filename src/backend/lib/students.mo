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
  ) : [StudentTypes.Student] {
    let now = Time.now();
    var currentId = nextId;
    let created = List.empty<StudentTypes.Student>();
    for (row in rows.values()) {
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
      created.add(student);
      currentId += 1;
    };
    created.toArray();
  };

  public func listStudentsByGroup(
    students : List.List<StudentTypes.Student>,
    group : Text
  ) : [StudentTypes.Student] {
    students.filter(func(s) { s.group == group }).toArray();
  };
};
