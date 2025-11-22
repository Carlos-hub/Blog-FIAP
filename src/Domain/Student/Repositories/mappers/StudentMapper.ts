import RepositoryMapper from "../../../Abstract/DTOs/RepositoryMapperInterface";
import { StudentDTO } from "../../DTOs/StudentDTO";
import { StudentEntity } from "../../interfaces/StudentEntityInterface";

export const studentMapper: RepositoryMapper<StudentEntity, StudentDTO> = {
    toEntity: (dto) => ({
      name: dto.name,
      email: dto.email,
      password: dto.password,
      createdAt: dto.createdAt,
      updatedAt: dto.updatedAt,
    }),
    toDTO: (entity) => ({
      id: String((entity as any)._id),
      name: entity.name,
      email: entity.email,
      password: entity.password,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    }),
  };