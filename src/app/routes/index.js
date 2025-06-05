import { Router } from 'express';
import messagesRouter from './messages.js';
import roomsRouter from './rooms.js';
import usersRouter from './users.js';
import eventsRouter from './events.js';

const router = Router();

router.use("/messages", messagesRouter);
router.use("/rooms", roomsRouter);
router.use("/users", usersRouter); 
router.use("/events", eventsRouter); 
export default router;
