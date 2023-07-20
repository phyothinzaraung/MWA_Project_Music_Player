import express, { NextFunction, Request, Response, json } from 'express';
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';

import authRouter from "./auth/auth.router";
import { ErrorResponse, IResponse } from './types';
import { verifyToken } from './auth/auth.middleware';
import songsRouter from './songs/songs.router';
import playlistsRouter from './playlists/playlists.router';

dotenv.config();
const app = express();

(async function () {
    try {
        if(!process.env.DB_CONNECTION) {
            console.log(`DB URL is null`)
            process.exit(1)
        }
        await mongoose.connect(process.env.DB_CONNECTION);
        console.log(`connected to MongoDB`)
    } catch (error) {
        console.log(`DB Connection Failed`, error)
        process.exit(1)
    }
})();

app.use((cors as (options: cors.CorsOptions) => express.RequestHandler)({}));
app.use(morgan('dev'));
app.use(json());

app.use("/music", express.static('music'));
app.use('/auth', authRouter);
app.use('/songs', songsRouter)
app.use('/playlists', verifyToken, playlistsRouter)

app.all('*', (req, res, next) => next(new Error(`Route not found`)))

app.use((error: ErrorResponse, req: Request, res: Response<IResponse<string>>, next: NextFunction) => {
    res.status(error.status || 500).json({ success: false, data: error.message })
})

app.listen(3000, () => {
    console.log("Listening to 3000");
})

process.on('beforeExit', async () => {
    await mongoose.disconnect();
    console.log(`MongoDB connection is terminated`)
})