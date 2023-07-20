import { RequestHandler } from "express";
import { BodyWithToken, ErrorResponse, IResponse } from "../types";
import Song, { ISong } from './songs.schema';
import { Types } from "mongoose";

export const add_song: RequestHandler<unknown, IResponse<ISong>, ISong> = async (req, res, next) => {
  try {
    const results = await Song.create({
      _id: new Types.ObjectId(),
      ...req.body
    })

    res.json({ success: true, data: results })
  } catch (error) {
    next(error)
  }
}

export const get_songs: RequestHandler<unknown, IResponse<ISong[]>, unknown, { search: string }> = async (req, res, next) => {
  try {
    const search_query: string = req.query.search || '';
    const searchFilter = search_query ? { song_title: { $regex: `.*${search_query}.*`, $options: 'i' } } : {};

    const results = await Song.aggregate([
      { $match: searchFilter },
      { $sort: { song_title: 1 } },
      { $project: { createdAt: 0, updatedAt: 0 } }
    ]);

    res.json({ success: true, data: results });
  } catch (error) {
    next(error);
  }
}


export const get_songs_by_genre: RequestHandler<{ genre: string }, IResponse<ISong[]>> = async (req, res, next) => {
  try {
    const { genre } = req.params;
    const results = await Song.aggregate([
      { $match: { genre: { $regex: genre, $options: 'i' } } },
      { $sort: { song_title: 1 } },
      { $project: { createdAt: 0, updatedAt: 0 } }
    ]);
    res.json({ success: true, data: results });
  } catch (error) {
    next(error);
  }
};

export const get_songs_by_artist: RequestHandler<{ artist: string }, IResponse<ISong[]>> = async (req, res, next) => {
  try {
    const { artist } = req.params;
    const results = await Song.aggregate([
      { $match: { artist: { $regex: artist, $options: 'i' } } },
      { $sort: { song_title: 1 } },
      { $project: { createdAt: 0, updatedAt: 0 } }
    ]);
    res.json({ success: true, data: results });
  } catch (error) {
    next(error);
  }
};

export const get_artists: RequestHandler<unknown, IResponse<string[]>> = async (req, res, next) => {
  try {
    const results = await Song.aggregate([
      { $unwind: '$artist' },
      { $group: { _id: '$artist' } },
      { $project: { _id: 0, artist: '$_id' } },
      { $sort: { artist: 1 } }
    ]);

    const artists = results.map((result: { artist: string }) => result.artist);

    res.json({ success: true, data: artists });
  } catch (error) {
    next(error);
  }
}

export const get_genres: RequestHandler<unknown, IResponse<string[]>> = async (req, res, next) => {
  try {
    const results = await Song.aggregate([
      { $unwind: '$genre' },
      { $group: { _id: '$genre' } },
      { $project: { _id: 0, genre: '$_id' } },
      { $sort: { genre: 1 } }
    ]);

    const genres = results.map((result: { genre: string }) => result.genre);

    res.json({ success: true, data: genres });
  } catch (error) {
    next(error);
  }
}


export const update_song_by_id: RequestHandler<{ song_id: string }, IResponse<number>, ISong> = async (req, res, next) => {
  try {
    const { song_id } = req.params;
    const { song_title, song_url, genre, artist } = req.body;
    const results = await Song.updateOne(
      { _id: song_id },
      { $set: { song_title, song_url, genre, artist } }
    )
    res.json({ success: true, data: results.modifiedCount })
  } catch (error) {
    next(error)
  }
}

export const delete_song_by_id: RequestHandler<{ song_id: string }, IResponse<number>> = async (req, res, next) => {
  try {
    const { song_id } = req.params;
    const results = await Song.deleteOne({ _id: song_id })
    res.json({ success: true, data: results.deletedCount })
  } catch (error) {
    next(error)
  }
}