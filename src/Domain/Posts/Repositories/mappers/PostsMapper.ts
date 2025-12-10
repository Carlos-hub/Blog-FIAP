import RepositoryMapper from '../../../Abstract/DTOs/RepositoryMapperInterface';
import type { PostsInterface } from '../../Interfaces/PostsInterface';
import type { PostDTO } from '../../DTOs/PostDTO';

export const postsMapper: RepositoryMapper<PostsInterface, PostDTO> = {
  toEntity: (dto: PostDTO): PostsInterface => ({
      title: dto.title,
      content: dto.content,
      createdAt: dto.createdAt,
      updatedAt: dto.updatedAt,
      id: dto.id ?? '',
      authorId: dto.authorId,
      likes: dto.likes,
      deslikes: dto.deslikes
  }),
  toDTO: (entity: PostsInterface): PostDTO => ({
      title: entity.title,
      content: entity.content,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      authorId: entity.authorId,
      likes: entity.likes,
      deslikes: entity.deslikes
  }),
};