import { Schema, model, InferSchemaType, Types } from 'mongoose';
import { songSchema } from '../songs/songs.schema';

const playlistSchema = new Schema({
    _id: String,
    name: String,
    created_by: {
        user_id: Types.ObjectId,
        fullname: String,
        email: String
    },
    songs: [songSchema]
}, { timestamps: true, versionKey: false });

export type IPlaylist = InferSchemaType<typeof playlistSchema>;

export default model<IPlaylist>('playlist', playlistSchema);