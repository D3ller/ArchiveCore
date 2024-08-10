import {Router} from 'express';
import {getArtistBySlug, addArtist, getAllArtists} from "../controllers/artist.js";
import {middleware} from "../middleware/verifyConnect.js";

const router = Router();

router.get('/find/:slug', getArtistBySlug);
router.post('/add', middleware, addArtist);
router.post('/all', middleware, getAllArtists);

export default router;