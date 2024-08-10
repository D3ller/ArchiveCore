import {Router} from 'express';
import {createPlaylist, getPlaylist, getUserPlaylists, addSongToPlaylist, deleteSongFromPlaylist} from "../controllers/playlist.js";
import {middleware} from "../middleware/verifyConnect.js";
import  {ratelimit} from "../config/ratelimit.js";


const router = Router();
router.post('/create', middleware, ratelimit(60000, 5), createPlaylist);
router.get('/:slug', getPlaylist);
router.post('/user', middleware, getUserPlaylists);
router.post('/add', middleware, addSongToPlaylist);
router.post('/delete', middleware, deleteSongFromPlaylist);

export default router;