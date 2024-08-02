import {Router} from 'express';
import {toggleSubscription} from "../controllers/subscribe.js";
import {middleware} from "../middleware/verifyConnect.js";
import {ratelimit} from "../config/ratelimit.js";

const router = Router();

router.post('/toggle', middleware, ratelimit(300000, 20), toggleSubscription);

export default router;