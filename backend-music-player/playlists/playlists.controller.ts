import { RequestHandler } from "express";
import { BodyWithToken, ErrorResponse, IResponse } from "../types";
import Playlist, { IPlaylist } from './playlists.model';
import { Types } from "mongoose";
import { ISong } from "../songs/songs.schema";

export const add_playlist: RequestHandler<unknown, IResponse<IPlaylist>, IPlaylist & BodyWithToken> = async (req, res, next) => {
    try {
        const { _id: user_id, fullname, email } = req.body.token_data;
        const results = await Playlist.create({
            _id: new Types.ObjectId(),
            ...req.body,
            created_by: {
                user_id,
                fullname,
                email
            }
        })

        res.json({ success: true, data: results })
    } catch (error) {
        next(error)
    }
}

export const get_playlists: RequestHandler<unknown, IResponse<IPlaylist[]>, BodyWithToken> = async (req, res, next) => {
    try {

        const results = await Playlist.aggregate([
            { $match: { 'created_by.user_id': new Types.ObjectId(req.body.token_data._id) }},
            { $sort: { createdAt: -1 } },
            { $project: { name: 1 } }
        ]);
       
        res.json({ success: true, data: results });
    } catch (error) {
        next(error);
    }
}

export const get_playlist_by_id: RequestHandler<{ playlist_id: string }, IResponse<IPlaylist>, BodyWithToken> = async (req, res, next) => {
    try {
        const result = await Playlist.findOne(
            { _id: req.params.playlist_id},
            { name: 1, songs: 1 });
        if (!result) throw new ErrorResponse("Playlist Not Found", 404);
        res.json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
};

export const add_song_to_playlist: RequestHandler<{ playlist_id: string }, IResponse<string>, ISong & BodyWithToken> = async (req, res, next) => {
    try {
        const song = {
            ...req.body
        }
        const results = await Playlist.updateOne(
            { _id: req.params.playlist_id, 'created_by.user_id': req.body.token_data._id },
            { $push: { songs: song } }
        )
        res.json({ success: true, data: results.modifiedCount ? song._id!.toString() : "" })
    } catch (error) {
        next(error)
    }
};

export const remove_song_from_playlist: RequestHandler<{ playlist_id: string, song_id: string }, IResponse<number>, BodyWithToken> = async (req, res, next) => {
    try {
        const result = await Playlist.updateOne(
            {
                _id: req.params.playlist_id,
                'created_by.user_id': req.body.token_data._id,
                'songs._id': req.params.song_id
            },
            {
                $pull: { songs: { _id: req.params.song_id } }
            }
        )
        res.json({ success: true, data: result.modifiedCount })
    } catch (error) {
        next(error)
    }
};

export const delete_playlist: RequestHandler<{ playlist_id: string }, IResponse<number>, BodyWithToken> = async (req, res, next) => {
    try {
        const result = await Playlist.deleteOne(
            {
                _id: req.params.playlist_id,
                'created_by.user_id': req.body.token_data._id
            }
        )
        res.json({ success: true, data: result.deletedCount })
    } catch (error) {
        next(error)
    }
};
