export interface ProfessorDTO {
    name: string;
    email: string;
    password: string;
    createdAt?: Date;
    updatedAt?: Date;
    id?: string;
    isActive?: boolean;
    discipline?: string;
}