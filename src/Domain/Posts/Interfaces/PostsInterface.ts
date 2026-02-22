import { Types } from "mongoose";

export interface PostsInterface {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  authorId: Types.ObjectId;
  discipline: string;
  likes: number;
  deslikes: number;
}