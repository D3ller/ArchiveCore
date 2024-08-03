import {Router} from 'express';
import {searchSongAlbumArtist} from "../controllers/search.js";
import {middleware} from "../middleware/verifyConnect.js";

const router = Router();

router.get('/:search', searchSongAlbumArtist);

export default router;