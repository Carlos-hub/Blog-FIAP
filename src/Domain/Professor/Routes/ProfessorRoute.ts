import { Request, Response, Router } from 'express';
import ProfessorService from '../Services/ProfessorService';
import ProfessorRepository from '../Repositories/ProfessorRepository';
import { CustomError } from '../../../Exceptions/Exceptions';
import { ProfessorDTO } from '../DTOs/ProfessorDTO';
import { ok, created, handleError, fail } from '../../../infra/Http/ApiResponse';

export default class ProfessorRoute {
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
            return ok(res, professors);
        } catch (error) {
            return handleError(res, error);
        }
    }

    private async getProfessorById(req: Request, res: Response) {
        try {
            const professor = await this.professorService.getProfessorById(req.params.id);
            return ok(res, professor);
        } catch (error) {
            return handleError(res, error);
        }
    }

    private async createProfessor(req: Request, res: Response) {
        try {
			const { name, email, password, discipline } = req.body;
            if (!name || !email || !password || !discipline) {
				return fail(res, 400, 'Name, email, password and discipline are required');
            }
            const professorDTO: ProfessorDTO = { name, email, password, discipline };
            const professor = await this.professorService.createProfessor(professorDTO);
			console.log(professor);
            return created(res, professor);
        } catch (error) {
            return handleError(res, error);
        }
    }

    private async updateProfessor(req: Request, res: Response) {
        try {
            const professor = await this.professorService.updateProfessor(req.params.id, req.body);
            return ok(res, professor);
        } catch (error) {
            return handleError(res, error);
        }
    }

    private async deleteProfessor(req: Request, res: Response) {
        try {
            const professor = await this.professorService.deleteProfessor(req.params.id);
            return ok(res, professor);
        } catch (error) {
            return handleError(res, error);
        }
    }
}