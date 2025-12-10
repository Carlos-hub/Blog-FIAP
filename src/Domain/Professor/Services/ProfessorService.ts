import { ProfessorDTO } from "../DTOs/ProfessorDTO";
import ProfessorRepository from "../Repositories/ProfessorRepository";


export default class ProfessorService {
    constructor(private readonly professorRepository: ProfessorRepository) {
        this.professorRepository = professorRepository;
    }

    async getProfessors(): Promise<ProfessorDTO[]> {
        return await this.professorRepository.findAll();
    }

    async getProfessorById(id: string): Promise<ProfessorDTO> {
        const professor = await this.professorRepository.findById(id);
        if (!professor) {
            throw new Error(`Professor with id ${id} not found.`);
        }
        return professor;
    }

    async createProfessor(professor: ProfessorDTO): Promise<ProfessorDTO> {
        return await this.professorRepository.create(professor);
    }

    async updateProfessor(id: string, professor: ProfessorDTO): Promise<ProfessorDTO> {
        const updated = await this.professorRepository.update(id, professor);
        if (!updated) {
            throw new Error(`Professor with id ${id} not found.`);
        }
        return updated;
    }

    async deleteProfessor(id: string): Promise<boolean> {
        return await this.professorRepository.delete(id);
    }
}