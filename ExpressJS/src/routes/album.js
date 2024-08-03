import {Router} from 'express';
import {getAlbumBySlug} from "../controllers/album.js";
import {middleware} from "../middleware/verifyConnect.js";

const router = Router();

router.get('/find/:slug', getAlbumBySlug);

export default router;