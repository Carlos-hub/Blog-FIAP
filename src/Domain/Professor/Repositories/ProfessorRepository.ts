import { ProfessorModel } from "../../../infra/Database/Models/Professor/ProfessorModel";
import AbstractRepository from "../../Abstract/Repository/AbstractRepository";
import { ProfessorDTO } from "../DTOs/ProfessorDTO";
import { ProfessorEntity } from "../Interfaces/ProfessorEntityInterface";
import { professorMapper } from "./mappers/ProfessorMapper";

export default class ProfessorRepository extends AbstractRepository<ProfessorEntity, ProfessorDTO> {
    constructor() {
        super(ProfessorModel, professorMapper);
    }
}