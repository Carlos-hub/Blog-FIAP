import { PostDTO } from "../DTOs/PostDTO";
import AbstractRepository from "../../Abstract/Repository/AbstractRepository";
import { PostsInterface } from "../Interfaces/PostsInterface";
import { PostModel } from "../../../infra/Database/Models/Post/PostModel";
import { postsMapper } from "./mappers/PostsMapper";

export default class PostsRepository extends AbstractRepository<PostsInterface, PostDTO> {
    constructor() {
        super(PostModel, postsMapper);
    }
}