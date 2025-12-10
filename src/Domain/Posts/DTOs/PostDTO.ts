export interface PostDTO {
    id?: string;
    title: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    authorId: string;
    likes: number;
    deslikes: number;
}