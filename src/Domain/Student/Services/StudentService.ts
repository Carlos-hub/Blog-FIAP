import { StudentDTO } from "../DTOs/StudentDTO";
import { StudentServiceInterface } from "../interfaces/StudentServiceInterface";
import { StudentRepository } from "../Repositories/StudentRepository";

export default class StudentService implements StudentServiceInterface {
    constructor(private readonly studentRepository: StudentRepository) {
        this.studentRepository = studentRepository;
    }
    createStudent(student: StudentDTO): Promise<StudentDTO> {
        return this.studentRepository.create(student);
    }
    async getStudentById(id: string): Promise<StudentDTO> {
        const student = await this.studentRepository.findById(id);
        if (!student) {
            throw new Error(`Student with id ${id} not found.`);
        }
        return student;
    }
    async getStudents(): Promise<StudentDTO[]> {
        return await this.studentRepository.findAll();
    }

    async updateStudent(id: string, student: StudentDTO): Promise<StudentDTO> {
        const updatedStudent = await this.studentRepository.update(id, student);
        if (!updatedStudent) {
            throw new Error(`Student with id ${id} not found.`);
        }
        return updatedStudent;
    }

    async deleteStudent(id: string): Promise<boolean> {
        return await this.studentRepository.delete(id);
    }
}