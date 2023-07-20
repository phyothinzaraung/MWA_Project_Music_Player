import { Router } from 'express';
import { add_playlist, add_song_to_playlist, delete_playlist, get_playlist_by_id, get_playlists, remove_song_from_playlist } from './playlists.controller';

const router = Router();

router.post('/', add_playlist);
router.get('/', get_playlists);
router.get('/:playlist_id', get_playlist_by_id);
router.post('/:playlist_id', add_song_to_playlist);
router.delete('/:playlist_id/songs/:song_id', remove_song_from_playlist);
router.delete('/:playlist_id', delete_playlist);

export default router;