import { StudentRepository } from "../Repositories/StudentRepository";
import StudentService from "../Services/StudentService";
import { Express, Request, Response, Router } from 'express';
import { CustomError } from '../../../Exceptions/Exceptions';

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
        router.delete(this.routePrefix, this.deleteStudent.bind(this));
    }

    private async getStudents(req: Request, res: Response) {
        try {
            const students = await this.studentService.getStudents();
            res.status(200).json(students);
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
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
            res.status(200).json(student);
        } catch (error: any) {
            res.status(error.statusCode).json({ error: (error).message });
        }
    }

    private async createStudent(req: Request, res: Response) {
        try {
            const body = req.body;
            if (!body.name || !body.email || !body.password) {
                throw new CustomError('Name, email and password are required', 400);
            }
            const student = await this.studentService.createStudent(body);
            res.status(201).json(student);
        } catch (error: CustomError | any) {
            res.status(error.statusCode).json({ error: (error).message });
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
            res.json(student);
        } catch (error: CustomError | any) {
            res.status(error.statusCode).json({ error: (error).message });
        }
    }
    private async deleteStudent(req: Request, res: Response) {
        try {
            const { id } = req.params;
            if (!id) {
                throw new CustomError('ID is required', 400);
            }
            const student = await this.studentService.deleteStudent(id);
            res.status(200).json(student);
        } catch (error: CustomError | any) {
            res.status(error.statusCode).json({ error: (error).message });
        } 
    }
}