import { Router } from 'express';
import EventsController from '../controllers/EventsController.js';

const router = Router();

router.get("/", (req, res) => EventsController.connect(req, res));

export default router;