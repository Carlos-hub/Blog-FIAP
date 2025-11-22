export default interface RepositoryMapper<TEntity, TDTO> {
    toEntity(dto: TDTO): Partial<TEntity>;
    toDTO(entity: TEntity): TDTO;
  }