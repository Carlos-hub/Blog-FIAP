import mongoose, { Model, Schema } from 'mongoose';
import { PostsInterface } from '../../../../Domain/Posts/Interfaces/PostsInterface';



const postSchema: Schema<PostsInterface> = new Schema<PostsInterface>({
    title: { type: String, required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    authorId: { type: String, required: true },
    likes: { type: Number, default: 0 },
    deslikes: { type: Number, default: 0 },
});

export const PostModel: Model<PostsInterface> =
  (mongoose.models.posts as Model<PostsInterface>) ||
  mongoose.model<PostsInterface>('posts', postSchema);
