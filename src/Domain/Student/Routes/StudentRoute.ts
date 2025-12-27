import { StudentRepository } from "../Repositories/StudentRepository";
import StudentService from "../Services/StudentService";
import { Request, Response, Router } from 'express';
import { CustomError } from '../../../Exceptions/Exceptions';
import { ok, created, handleError } from "../../../infra/Http/ApiResponse";

export default class StudentRoute {
    private readonly studentService: StudentService;
    private routePrefix: string = '/students';
    constructor(private readonly router: Router) {
        const studentRepository = new StudentRepository();
        const studentService = new StudentService(studentRepository);
        this.studentService = studentService;
        router.post(this.routePrefix+'/', this.createStudent.bind(this));
        router.get(this.routePrefix+'/', this.getStudents.bind(this));
        router.get(this.routePrefix+'/:id', this.getStudentById.bind(this));
        router.put(this.routePrefix+'/:id', this.updateStudent.bind(this));
        router.delete(this.routePrefix+'/:id', this.deleteStudent.bind(this));
    }

    private async getStudents(req: Request, res: Response) {
        try {
            const students = await this.studentService.getStudents();
            return ok(res, students);
        } catch (error) {
            return handleError(res, error);
        }
    }
    private async getStudentById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            if (!id) {
                throw new CustomError('ID is required', 400);
            }
            const student = (await this.studentService.getStudentById(id));
            if (!student) {
                throw new CustomError('Student not found', 404);
            }
            return ok(res, student);
        } catch (error: any) {
            return handleError(res, error);
        }
    }

    private async createStudent(req: Request, res: Response) {
        try {
            const body = req.body;
            if (!body.name || !body.email || !body.password) {
                throw new CustomError('Name, email and password are required', 400);
            }
            const student = await this.studentService.createStudent(body);
            return created(res, student);
        } catch (error: CustomError | any) {
            return handleError(res, error);
        }
    }

    private async updateStudent(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const body = req.body;
            if (!id) {
                throw new CustomError('ID is required', 400);
            }
            const student = await this.studentService.updateStudent(id, body);
            return ok(res, student);
        } catch (error: CustomError | any) {
            return handleError(res, error);
        }
    }
    private async deleteStudent(req: Request, res: Response) {
        try {
            const { id } = req.params;
            if (!id) {
                throw new CustomError('ID is required', 400);
            }
            const student = await this.studentService.deleteStudent(id);
            return ok(res, student);
        } catch (error: CustomError | any) {
            return handleError(res, error);
        } 
    }
}