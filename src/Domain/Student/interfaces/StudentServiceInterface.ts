import { StudentDTO } from "../DTOs/StudentDTO";

export interface StudentServiceInterface {
    createStudent(student: StudentDTO): Promise<StudentDTO>;
    getStudentById(id: string): Promise<StudentDTO>;
    getStudents(): Promise<StudentDTO[]>;
    updateStudent(id: string, student: StudentDTO): Promise<StudentDTO>;
    deleteStudent(id: string): Promise<boolean>;
}