import {Router} from 'express';
import {loginAccount, logoutAccount, registerAccount, updateAccount} from '../controllers/user.js';
import {middleware} from "../middleware/verifyConnect.js";
import  {ratelimit} from "../config/ratelimit.js";

const router = Router();

router.post('/register', registerAccount);
router.post('/login', loginAccount);
router.put('/update', ratelimit(15 * 60 * 1000, 5), middleware, updateAccount);
router.post('/logout', middleware, logoutAccount);

export default router;