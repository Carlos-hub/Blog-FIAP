import RepositoryMapper from "../../../Abstract/DTOs/RepositoryMapperInterface";
import { ProfessorDTO } from "../../DTOs/ProfessorDTO";
import { ProfessorEntity } from "../../Interfaces/ProfessorEntityInterface";

export const professorMapper: RepositoryMapper<ProfessorEntity, ProfessorDTO> = {
    toEntity: (dto) => ({
      name: dto.name,
      email: dto.email,
      password: dto.password,
      createdAt: dto.createdAt,
      updatedAt: dto.updatedAt,
      isActive: dto.isActive,
      discipline: dto.discipline,
    }),
    toDTO: (entity) => ({
      id: String((entity as any)._id),
      name: entity.name,
      email: entity.email,
      password: entity.password,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      isActive: entity.isActive,
      discipline: entity.discipline,
    }),
  };