import { ISong } from "./ISong.interface";

export interface IPlaylist{
    _id: string,
    name: string,
    songs: ISong[]
}