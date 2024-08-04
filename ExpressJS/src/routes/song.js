import {Router} from 'express';
import {addSong, getSongBySlug, generateSlug} from "../controllers/song.js";
import {middleware} from "../middleware/verifyConnect.js";
import {ratelimit} from "../config/ratelimit.js";

const router = Router();

router.post('/add', middleware, addSong);
router.get('/find/:slug', getSongBySlug);
router.get('/generateSlug', ratelimit(15 * 60 * 1000, 20), generateSlug);

export default router;