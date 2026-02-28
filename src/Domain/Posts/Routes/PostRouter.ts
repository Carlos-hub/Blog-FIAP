import { Router, Request, Response } from "express";
import PostService from "../Services/PostService";
import PostsRepository from "../Repositories/PostsRepository";
import { CustomError } from "../../../Exceptions/Exceptions";
import { PostDTO } from "../DTOs/PostDTO";
import { ok, created, handleError } from "../../../infra/Http/ApiResponse";
import { requireProfessorAuth, requireStudentOrProfessorAuth } from "../../../infra/Auth/Middleware";
import { Types } from "mongoose";


export default class PostRouter {
    private readonly postService: PostService;
    private routePrefix: string = '/posts';

    constructor(private readonly router: Router) {
        const postRepository = new PostsRepository();
        const postService = new PostService(postRepository);
        this.postService = postService;
        router.get(this.routePrefix+'/search', requireStudentOrProfessorAuth, this.searchPosts.bind(this));
        router.post(this.routePrefix, requireProfessorAuth, this.createPost.bind(this));
        router.get(this.routePrefix, requireStudentOrProfessorAuth, this.getPosts.bind(this));
        router.get(this.routePrefix+'/:id', requireStudentOrProfessorAuth, this.getPostById.bind(this));
        router.put(this.routePrefix+'/:id', requireProfessorAuth, this.updatePost.bind(this));
        router.delete(this.routePrefix+'/:id', requireProfessorAuth, this.deletePost.bind(this));
    }

    private getAuthorId(author: any): string {
        if (!author) {
            return '';
        }
        if (typeof author === 'string') {
            return author;
        }
        if (author._id) {
            return String(author._id);
        }
        return String(author);
    }

    private async createPost(req: Request, res: Response) {
        const { title, content, discipline } = req.body;
        if (!title || !content) {
            throw new CustomError('Title and content are required', 400);
        }
        const user = (req as any).user as { id: string; discipline: string };
        if (!user) {
            throw new CustomError('Unauthorized', 401);
        }
        if (discipline && discipline !== user.discipline) {
            throw new CustomError('Discipline mismatch', 403);
        }
        const postDTO: PostDTO = {
            title: title,
            content: content,
            authorId: new Types.ObjectId(user.id as string),
            discipline: user.discipline,
            createdAt: new Date(),
            updatedAt: new Date(),
            likes: 0,
            deslikes: 0,
        };
        try {
            const post = await this.postService.createPost(postDTO);
            return created(res, post);
        } catch (error: CustomError | any) {
            return handleError(res, error);
        }
    }

    private async getPostById(req: Request, res: Response) {
        try {
            const post = await this.postService.getPostById(req.params.id);
            return ok(res, post);
        } catch (error: CustomError | any) {
            return handleError(res, error);
        }
    }

    private async getPosts(req: Request, res: Response) {
        try {
            const posts = await this.postService.getPosts();
			return ok(res, posts);
        } catch (error: CustomError | any) {
            return handleError(res, error);
        }
    }

    private async updatePost(req: Request, res: Response) {
        try {
            const existing = await this.postService.getPostById(req.params.id);

            const user = (req as any).user as { id: string; discipline?: string };
            const authorId = this.getAuthorId((existing as any).authorId);
            if (!user || user.id !== authorId) {
                throw new CustomError('Forbidden', 403);
            }
            const { title, content } = req.body as { title?: string; content?: string };
            const updateDTO: PostDTO = {
                id: existing.id,
                title: title ?? existing.title,
                content: content ?? existing.content,
                createdAt: existing.createdAt,
                updatedAt: new Date(),
                authorId: new Types.ObjectId(user.id as string),
                discipline: user.discipline ?? existing.discipline,
                likes: existing.likes,
                deslikes: existing.deslikes,
            };
            const post = await this.postService.updatePost(req.params.id, updateDTO);
            return ok(res, post);
        } catch (error: CustomError | any) {
            return handleError(res, error);
        }
    }

    private async deletePost(req: Request, res: Response) {
        try {
            const existing = await this.postService.getPostById(req.params.id);
            const user = (req as any).user as { id: string; discipline?: string };
            const authorId = this.getAuthorId((existing as any).authorId);
            if (!user || user.id !== authorId) {
                throw new CustomError('Forbidden', 403);
            }
            const deleted = await this.postService.deletePost(req.params.id);
            return ok(res, { deleted });
        } catch (error: CustomError | any) {
            return handleError(res, error);
        }
    }

    private async searchPosts(req: Request, res: Response) {
        const term = (req.query.q as string) || '';
        if (!term.trim()) {
            return ok(res, []);
        }
        try {
            const posts = await this.postService.searchPosts(term);
            return ok(res, posts);
        } catch (error: CustomError | any) {
            return handleError(res, error);
        }
    }
}