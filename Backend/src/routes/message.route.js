import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { 
    getUsersforSidebar,
    getMessages,
    postMessage
} from '../controllers/message.controller.js';

const router = express.Router();

router.get('/users', protectRoute, getUsersforSidebar);
router.get('/:id', protectRoute, getMessages);
router.post('/send/:id', protectRoute, postMessage);

export default router;
