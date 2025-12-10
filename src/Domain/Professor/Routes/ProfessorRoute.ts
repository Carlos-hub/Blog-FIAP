import { Request, Response, Router } from 'express';
import ProfessorService from '../Services/ProfessorService';
import ProfessorRepository from '../Repositories/ProfessorRepository';
import { CustomError } from '../../../Exceptions/Exceptions';
import { ProfessorDTO } from '../DTOs/ProfessorDTO';

export default class StudentRoute {
    private readonly professorService: ProfessorService;
    private routePrefix: string = '/professors';
    constructor(private readonly router: Router) {
        const professorRepository = new ProfessorRepository();
        const professorService = new ProfessorService(professorRepository);
        this.professorService = professorService;
        router.get(this.routePrefix, this.getProfessors.bind(this));
        router.get(this.routePrefix + '/:id', this.getProfessorById.bind(this));
        router.post(this.routePrefix, this.createProfessor.bind(this));
        router.put(this.routePrefix + '/:id', this.updateProfessor.bind(this));
        router.delete(this.routePrefix + '/:id', this.deleteProfessor.bind(this));
    }

    private async getProfessors(req: Request, res: Response) {
        try {
            const professors = await this.professorService.getProfessors();
            res.status(200).json(professors);
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    }

    private async getProfessorById(req: Request, res: Response) {
        try {
            const professor = await this.professorService.getProfessorById(req.params.id);
            res.status(200).json(professor);
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    }

    private async createProfessor(req: Request, res: Response) {
        try {
            const { name, email, password, discipline } = req.body;
            if (!name || !email || !password || !discipline) {
                throw new CustomError('Name, email, password and discipline are required', 400);
            }
            const professorDTO: ProfessorDTO = { name, email, password, discipline };
            const professor = await this.professorService.createProfessor(professorDTO);
            res.status(201).json(professor);
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    }

    private async updateProfessor(req: Request, res: Response) {
        try {
            const professor = await this.professorService.updateProfessor(req.params.id, req.body);
            res.status(200).json(professor);
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    }

    private async deleteProfessor(req: Request, res: Response) {
        try {
            const professor = await this.professorService.deleteProfessor(req.params.id);
            res.status(200).json(professor);
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    }
}