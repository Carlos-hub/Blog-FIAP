import { PostDTO } from "../DTOs/PostDTO";
import PostsRepository from "../Repositories/PostsRepository";

export default class PostService {
    constructor(private readonly postRepository: PostsRepository) {
        this.postRepository = postRepository;
    }
    async createPost(post: PostDTO): Promise<PostDTO> {
        return await this.postRepository.create(post);
    }

    async getPostById(id: string): Promise<PostDTO> {
        const post = await this.postRepository.findById(id);
        if (!post) {
            throw new Error(`Post with id ${id} not found`);
        }
        return post;
    }

    async getPosts(): Promise<PostDTO[]> {
        return await this.postRepository.findAll();
    }

    async updatePost(id: string, post: PostDTO): Promise<PostDTO> {
        const updatedPost = await this.postRepository.update(id, post);
        if (!updatedPost) {
            throw new Error(`Post with id ${id} not found`);
        }
        return updatedPost;
    }

    async deletePost(id: string): Promise<boolean> {
        const deletedPost = await this.postRepository.delete(id);
        if (!deletedPost) {
            throw new Error(`Post with id ${id} not found`);
        }
        return deletedPost;
    }
}