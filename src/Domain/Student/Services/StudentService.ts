import bcrypt from 'bcrypt';
import { StudentDTO } from "../DTOs/StudentDTO";
import { StudentServiceInterface } from "../interfaces/StudentServiceInterface";
import { StudentRepository } from "../Repositories/StudentRepository";
import { CustomError } from '../../../Exceptions/Exceptions';

export default class StudentService implements StudentServiceInterface {
    constructor(private readonly studentRepository: StudentRepository) {
        this.studentRepository = studentRepository;
    }
    async createStudent(student: StudentDTO): Promise<StudentDTO> {

        const existingStudent = await this.studentRepository.findByEmail(student.email);
        if (existingStudent) {
            throw new CustomError(`Student with email ${student.email} already exists.`, 400);
        }
        const hashedPassword = await bcrypt.hash(student.password, 10);
        student.password = hashedPassword;

        const newStudent = await this.studentRepository.create(student);
        return newStudent;

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
        if (! updatedStudent) {
            throw new CustomError(`Student with id ${id} not found.`, 404);
        }
        return updatedStudent;
    }

    async deleteStudent(id: string): Promise<boolean> {
        return await this.studentRepository.delete(id);
    }
}