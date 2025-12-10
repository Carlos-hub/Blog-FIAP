import { Router, Request, Response } from "express";
import PostService from "../Services/PostService";
import PostsRepository from "../Repositories/PostsRepository";
import { CustomError } from "../../../Exceptions/Exceptions";
import { PostDTO } from "../DTOs/PostDTO";


export default class PostRouter {
    private readonly postService: PostService;
    private routePrefix: string = '/posts';

    constructor(private readonly router: Router) {
        const postRepository = new PostsRepository();
        const postService = new PostService(postRepository);
        this.postService = postService;
        router.post(this.routePrefix, this.createPost.bind(this));
        router.get(this.routePrefix, this.getPosts.bind(this));
        router.get(this.routePrefix+'/:id', this.getPostById.bind(this));
        router.put(this.routePrefix+'/:id', this.updatePost.bind(this));
        router.delete(this.routePrefix+'/:id', this.deletePost.bind(this));
    }

    private async createPost(req: Request, res: Response) {
        console.log('createPost');
        const { title, content, authorId } = req.body;
        if (!title || !content || !authorId) {
            throw new CustomError('Title, content and authorId are required', 400);
        }
        const postDTO: PostDTO = {
            title: title,
            content: content,
            authorId: authorId,
            createdAt: new Date(),
            updatedAt: new Date(),
            likes: 0,
            deslikes: 0,
        };
        try {
            const post = await this.postService.createPost(postDTO);
            res.status(201).json(post);
        } catch (error: CustomError | any) {
            res.status(error.statusCode).json({ error: (error).message });
        }
    }

    private async getPostById(req: Request, res: Response) {
        try {
            const post = await this.postService.getPostById(req.params.id);
            res.status(200).json(post);
        } catch (error: CustomError | any) {
            res.status(error.statusCode).json({ error: (error).message });
        }
    }

    private async getPosts(req: Request, res: Response) {
        try {
            const posts = await this.postService.getPosts();
            res.status(200).json(posts);
        } catch (error: CustomError | any) {
            res.status(error.statusCode).json({ error: (error).message });
        }
    }

    private async updatePost(req: Request, res: Response) {
        try {
            const post = await this.postService.updatePost(req.params.id, req.body);
            res.status(200).json(post);
        } catch (error: CustomError | any) {
            res.status(error.statusCode).json({ error: (error).message });
        }
    }

    private async deletePost(req: Request, res: Response) {
        try {
            const post = await this.postService.deletePost(req.params.id);
            res.status(200).json(post);
        } catch (error: CustomError | any) {
            res.status(error.statusCode).json({ error: (error).message });
        }
    }
}