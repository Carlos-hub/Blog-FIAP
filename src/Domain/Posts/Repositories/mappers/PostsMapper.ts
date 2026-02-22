import RepositoryMapper from '../../../Abstract/DTOs/RepositoryMapperInterface';
import type { PostsInterface } from '../../Interfaces/PostsInterface';
import type { PostDTO } from '../../DTOs/PostDTO';
import { Types } from 'mongoose';

export const postsMapper: RepositoryMapper<PostsInterface, PostDTO> = {
  toEntity: (dto: PostDTO): PostsInterface => ({
      title: dto.title,
      content: dto.content,
      createdAt: dto.createdAt,
      updatedAt: dto.updatedAt,
      id: dto.id ?? '',
      authorId: new Types.ObjectId(dto.authorId),
      discipline: dto.discipline,
      likes: dto.likes,
      deslikes: dto.deslikes
  }),
  toDTO: (entity: PostsInterface): PostDTO => ({
      id: String((entity as any)._id ?? (entity as any).id ?? ''),
      title: entity.title,
      content: entity.content,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      authorId: entity.authorId.toString(),
      discipline: entity.discipline,
      likes: entity.likes,
      deslikes: entity.deslikes
  }),
};