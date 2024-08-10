import {Router} from 'express';
import {addToHistory, startListening, getHistory} from "../controllers/history.js";
import {middleware} from "../middleware/verifyConnect.js";

const router = Router();

router.post('/add', middleware, addToHistory);
router.post('/startListening', middleware, startListening);
router.get('/get', middleware, getHistory);

export default router;