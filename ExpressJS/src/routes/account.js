import {Router} from 'express';
import {getAccount} from "../controllers/account.js";
import {middleware} from "../middleware/verifyConnect.js";
import  {ratelimit} from "../config/ratelimit.js";

const router = Router();

router.get('/get', middleware, getAccount);

export default router;