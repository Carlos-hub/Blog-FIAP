import RepositoryMapper from '../../../Abstract/DTOs/RepositoryMapperInterface';
import type { PostsInterface } from '../../Interfaces/PostsInterface';
import type { PostDTO } from '../../DTOs/PostDTO';

export const postsMapper: RepositoryMapper<PostsInterface, PostDTO> = {
  toEntity: (dto: PostDTO): PostsInterface => ({
      title: dto.title,
      content: dto.content,
      createdAt: dto.createdAt,
      updatedAt: dto.updatedAt,
      id: '',
      authorId: '',
      likes: 0,
      deslikes: 0
  }),
  toDTO: (entity: PostsInterface): PostDTO => ({
      title: entity.title,
      content: entity.content,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      authorId: '',
      likes: 0,
      deslikes: 0
  }),
};