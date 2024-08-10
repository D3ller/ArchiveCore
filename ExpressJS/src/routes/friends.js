import {Router} from 'express';
import {getFriends, addFriend, acceptFriend} from "../controllers/friends.js";
import {middleware} from "../middleware/verifyConnect.js";

const router = Router();

router.get('/get', middleware, getFriends);
router.post('/add', middleware, addFriend);
router.post('/accept', middleware, acceptFriend);

export default router;