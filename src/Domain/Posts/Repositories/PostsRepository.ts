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
}