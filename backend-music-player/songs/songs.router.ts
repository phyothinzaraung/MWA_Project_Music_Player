import { Router } from 'express';
import { add_song, delete_song_by_id, get_artists, get_genres, get_songs, get_songs_by_artist, get_songs_by_genre, update_song_by_id } from './songs.controller';

const router = Router();

router.post('/', add_song);
router.get('/', get_songs);
router.get('/genres/:genre', get_songs_by_genre);
router.get('/artists/:artist', get_songs_by_artist);
router.get('/artists', get_artists);
router.get('/genres', get_genres);
router.put('/:song_id', update_song_by_id);
router.delete('/:song_id', delete_song_by_id);

export default router;