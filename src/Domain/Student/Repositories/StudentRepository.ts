import AbstractRepository from "../../Abstract/Repository/AbstractRepository";
import { StudentDTO } from "../DTOs/StudentDTO";
import { StudentEntity } from "../interfaces/StudentEntityInterface";

import { StudentsModel } from "../../../infra/Database/Models/Students/StudentsModel";
import { studentMapper } from "./mappers/StudentMapper";

export class StudentRepository extends AbstractRepository<StudentEntity, StudentDTO> {
    constructor() {
      super(StudentsModel, studentMapper);
    }

    async findByEmail(email: string): Promise<StudentDTO | null> {
        const student = await this.model.findOne({ email }).lean();
        return student ? this.mapper.toDTO(student as StudentEntity) : null;
    }
}