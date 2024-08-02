import {Router} from 'express';
import {getArtistBySlug} from "../controllers/artist.js";
import {middleware} from "../middleware/verifyConnect.js";

const router = Router();

router.get('/find/:slug', getArtistBySlug);

export default router;