import {Router} from 'express';
import {addToHistory} from "../controllers/history.js";
import {middleware} from "../middleware/verifyConnect.js";

const router = Router();

router.post('/add', middleware, addToHistory);

export default router;