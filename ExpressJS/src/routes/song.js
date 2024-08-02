import {Router} from 'express';
import {addSong, getSongBySlug} from "../controllers/song.js";
import {middleware} from "../middleware/verifyConnect.js";
import {ratelimit} from "../config/ratelimit.js";

const router = Router();

router.post('/add', ratelimit(15 * 60 * 1000, 20), middleware, addSong);
router.get('/find/:slug', ratelimit(15 * 60 * 1000, 20), getSongBySlug);

export default router;