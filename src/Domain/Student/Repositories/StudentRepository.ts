import AbstractRepository from "../../Abstract/Repository/AbstractRepository";
import { StudentDTO } from "../DTOs/StudentDTO";
import { StudentEntity } from "../interfaces/StudentEntityInterface";

import { StudentsModel } from "../../../infra/Database/Models/Students/StudentsModel";
import { studentMapper } from "./mappers/StudentMapper";

export class StudentRepository extends AbstractRepository<StudentEntity, StudentDTO> {
    constructor() {
      super(StudentModel, studentMapper);
    }
}