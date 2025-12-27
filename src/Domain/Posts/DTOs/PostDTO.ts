export interface PostDTO {
    id?: string;
    title: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    authorId: string;
    discipline: string;
    likes: number;
    deslikes: number;
}