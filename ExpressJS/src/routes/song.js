import {Router} from 'express';
import {addSong} from "../controllers/song.js";
import {middleware} from "../middleware/verifyConnect.js";
import {ratelimit} from "../config/ratelimit.js";

const router = Router();

router.post('/add', ratelimit(15 * 60 * 1000, 20), middleware, addSong);

export default router;