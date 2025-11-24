import mongoose, { Schema, Model } from 'mongoose';
import { ProfessorEntity } from '../../../../Domain/Professor/Interfaces/ProfessorEntityInterface';

const ProfessorSchema: Schema<ProfessorEntity> = new Schema<ProfessorEntity>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 12, maxlength: 128 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true },
    discipline: { type: String, required: true },
});

export const ProfessorModel: Model<ProfessorEntity> =
  (mongoose.models.professors as Model<ProfessorEntity>) ||
  mongoose.model<ProfessorEntity>('professors', ProfessorSchema);
