import { Router } from 'express';
import messagesRouter from './messages.js';
import roomsRouter from './rooms.js';

const router = Router();

router.use("/messages", messagesRouter);
router.use("/rooms", roomsRouter);

export default router;
