import { Schema, model, InferSchemaType } from 'mongoose';

const userSchema = new Schema({
    _id: String,
    name: String,
    email: { type: String, unique: true },
    password: String
}, { timestamps: true, versionKey: false });


export type IUser = InferSchemaType<typeof userSchema>;

export default model<IUser>('user', userSchema);