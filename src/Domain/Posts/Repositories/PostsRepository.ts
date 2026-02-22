import { PostDTO } from "../DTOs/PostDTO";
import AbstractRepository from "../../Abstract/Repository/AbstractRepository";
import { PostsInterface } from "../Interfaces/PostsInterface";
import { PostModel } from "../../../infra/Database/Models/Post/PostModel";
import { postsMapper } from "./mappers/PostsMapper";

export default class PostsRepository extends AbstractRepository<PostsInterface, PostDTO> {
    constructor() {
        super(PostModel, postsMapper);
    }
    async searchByTerm(term: string): Promise<PostDTO[]> {
        const regex = new RegExp(term, 'i');
        const docs = await PostModel.find({
            $or: [{ title: { $regex: regex } }, { content: { $regex: regex } }]
        }).lean();
        return docs.map(d => this.mapper.toDTO(d as unknown as PostsInterface));
    }

	async findByAuthor(author: string): Promise<PostDTO[]> {
		const docs = await PostModel.find({ author }).lean();
		return docs.map(d => this.mapper.toDTO(d as unknown as PostsInterface));
	}

	async findByCategory(category: string): Promise<PostDTO[]> {
		const docs = await PostModel.find({ category }).lean();
		return docs.map(d => this.mapper.toDTO(d as unknown as PostsInterface));
	}

	async findByDate(date: Date): Promise<PostDTO[]> {
		const docs = await PostModel.find({ date }).lean();
		return docs.map(d => this.mapper.toDTO(d as unknown as PostsInterface));
	}

	async findById(id: string): Promise<PostDTO | null> {
		const doc = await PostModel.findById(id).populate('authorId', '_id name email discipline').lean();
		return doc ? this.mapper.toDTO(doc as unknown as PostsInterface) : null;
	}
}