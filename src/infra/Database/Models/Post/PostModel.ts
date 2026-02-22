import mongoose, { Model, Schema } from 'mongoose';
import { PostsInterface } from '../../../../Domain/Posts/Interfaces/PostsInterface';



const postSchema = new Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    authorId: { type: Schema.Types.ObjectId, ref: "professors", required: true },
    discipline: { type: String, required: true },
    likes: { type: Number, default: 0 },
    deslikes: { type: Number, default: 0 },
});

export const PostModel = mongoose.model<PostsInterface>('posts', postSchema);
