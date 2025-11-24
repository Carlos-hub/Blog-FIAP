export interface ProfessorEntity {
    _id: any;
    name: string;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
    isActive: boolean;
    discipline: string;
}