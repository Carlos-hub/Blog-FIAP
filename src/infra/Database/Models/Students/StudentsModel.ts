import mongoose, { Schema, Model } from 'mongoose';
import { StudentEntity } from '../../../../Domain/Student/interfaces/StudentEntityInterface';

const StudentSchema: Schema<StudentEntity> = new Schema<StudentEntity>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 12, maxlength: 128 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

export const StudentsModel: Model<StudentEntity> =
  (mongoose.models.Students as Model<StudentEntity>) ||
  mongoose.model<StudentEntity>('Students', StudentSchema);
