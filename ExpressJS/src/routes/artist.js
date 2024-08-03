import {Router} from 'express';
import {getArtistBySlug, addArtist} from "../controllers/artist.js";
import {middleware} from "../middleware/verifyConnect.js";

const router = Router();

router.get('/find/:slug', getArtistBySlug);
router.post('/add', middleware, addArtist);

export default router;