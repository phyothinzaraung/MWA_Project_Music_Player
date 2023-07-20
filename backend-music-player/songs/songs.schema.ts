import { Schema, model, InferSchemaType } from 'mongoose';

export const songSchema = new Schema({
    _id: String,
    song_title: String,
    song_url: String,
    genre: [String],
    artist: [String]
  }, {timestamps: true, versionKey: false});
  
  export type ISong = InferSchemaType<typeof songSchema>;
  export default model<ISong>('song', songSchema)